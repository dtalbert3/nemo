import config from 'clientconfig';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken';

const auth = io.connect(config.apiUrl + '/auth', {
  'query': 'token=' + localStorage.token
});

const user = io.connect(config.apiUrl + '/user', {
  'query': 'token=' + localStorage.token
});

export default {
  login(email, password, callback) {
    auth.emit('local', {
      email: email,
      password: password
    }, (error, result) => {
      if (!error) {
        console.log(result);
        var payload = jwt.decode(result, {complete: true, force: true}).payload;
        localStorage.token = result;
        localStorage.userType = payload.userType;
        localStorage.userID = payload.ID;
        callback(true);
      } else {
        console.log(error);
        callback(false);
      }
    });
  },

  getToken() {
    // possibly remove?
    return localStorage.token;
  },

  logout(callback) {
    // Delete token locally and on server?
    console.log('logging out');
    delete localStorage.token;
    delete localStorage.userType;
    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  loggedIn() {
    // Get and validate token against server
    localStorage.getItem('token');
    return !!localStorage.token;
  },

  onChange() {},

  createUser(email, password) {

    var userInfo = {
      email: email,
      password: password
    };

    user.emit('signup', userInfo, (err, data) => {
      if (!err) {
        console.log(data);
      } else {
        console.log(err);
      }
    });
  }
};
