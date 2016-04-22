import config from 'clientconfig';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken';

const auth = io.connect(config.apiUrl + '/auth', {
  'query': 'token=' + localStorage.getItem('token')
});

export default {
  login(email, password, callback) {
    auth.emit('local', {
      email: email,
      password: password
    }, (error, result) => {
      if (!error) {
        var payload = jwt.decode(result, {complete: true, force: true}).payload;
        localStorage.setItem('token', result);
        localStorage.setItem('userType', payload.userType);
        localStorage.setItem('userID', payload.ID);
        callback(true);
      } else {
        console.log(error);
        callback(false);
      }
    });
  },

  getToken() {
    return localStorage.getItem('token');
  },

  logout(callback) {
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
};
