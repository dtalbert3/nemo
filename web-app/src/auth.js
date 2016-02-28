import io from 'socket.io-client';
const socket = io();

export default {
  login(email, password, callback) {
    // Do stuff with token?
    // if (localStorage.token) {
    //   if (callback) {
    //     callback(false);
    //   }
    //   this.onChange(true);
    //   return;
    // }
    socket.emit('user::authenticate', {
      type: 'local',
      email: email,
      password: password
    }, (error, results) => {
      if (!error) {
        console.log(results);
        callback(true);
      } else {
        console.log(error);
        callback(false);
      }
    });
    // socket.emit('user::find',
    //   {email: email, password: password},
    //   (err, data) => {
    //     if (!err) {
    //       localStorage.token = data.token;
    //       localStorage.userType = data.userType;
    //       callback(true);
    //     } else {
    //       callback(false);
    //     }
    //   }
    // );
    // Else get a new token from server
  },

  getToken() {
    // Get and validate token against e
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

    socket.emit('user::signup', userInfo, {}, (err, data) => {
      if (!err) {
        console.log(data);
      }
    });
  }
};
