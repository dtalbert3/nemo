import * as questions from './redux/modules/nemoQuestions'
import * as questionCreator from './redux/modules/questionCreator'

import config from 'clientconfig'
import io from 'socket.io-client'

class NemoApi {

  constructor (store = null) {
    this.store = store
    this.userQuestions = []
    this.dash = io.connect(config.apiUrl + '/dash')
    this.qstn = io.connect(config.apiUrl + '/qstn')
    this.user = io.connect(config.apiUrl + '/user')
  }

  setStore (store) {
    this.store = store
  }

  signup (userData) {
    var promise = new Promise((resolve, reject) => {
      this.user.emit('signup', userData, (err, msg) => {
        if (!err) {
          resolve(msg)
        } else {
          reject(err)
        }
      })
    })
    return promise
  }

  fetchGlobalData () {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('getGlobal', {}, (err, data) => {
        if (!err) {
          data = JSON.parse(data)
          this.store.dispatch(questions.setGlobalQuestions(data))
          resolve('Fetched Global Questions')
        } else {
          reject('Error Fetching Global Questions')
        }
      })
    })
    return promise
  }

  fetchUserData () {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('getUser', localStorage.userID, {}, (err, data) => {
        if (!err) {
          data = JSON.parse(data)
          this.store.dispatch(questions.setUserQuestions(data))
          resolve('Fetched User Questions')
        } else {
          reject('Error Fetching User Questions')
        }
      })
    })
    return promise
  }

  deleteQuestion (id) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('delete', id, (err) => {
        if (!err) {
          resolve('Question Deleted')
        } else {
          reject('Error Deleting Question')
        }
      })
    })
    return promise
  }

  giveFeedback (params) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('feedback', params, (err) => {
        if (!err) {
          resolve('Feedback Received')
        } else {
          reject('Error Giving Feedback')
        }
      })
    })
    return promise
  }

  getTypes () {
    var promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem('questionTypes') === null) {
        this.qstn.emit('getTypes', (err, data) => {
          if (!err) {
            data = data.map((d) => d)
            this.store.dispatch(questionCreator.setQuestionTypes(data))
            resolve('Fetched Question Types')
          } else {
            reject('Error Fetching Question Types')
          }
        })
      } else {
        resolve()
      }
    })
    return promise
  }

  getEvents () {
    var promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem('questionEvents') === null) {
        this.qstn.emit('getEvents', (err, data) => {
          if (!err) {
            data = data.map((d) => d)
            this.store.dispatch(questionCreator.setQuestionEvents(data))
            resolve('Fetched Question Events')
          } else {
            reject('Error Fetching Question Events')
          }
        })
      } else {
        resolve()
      }
    })
    return promise
  }

  getSuggestions () {
    var promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem('suggestions') === null) {
        var startTime = new Date()
        this.qstn.emit('getSuggestions', (err, data) => {
          if (!err) {
            this.store.dispatch(questionCreator.setQuestionSuggestions(data))
            var endTime = new Date()
            console.log((endTime - startTime) / 1000, 'seconds')
            resolve('Fetched Parameter Suggestions')
          } else {
            reject('Error Fetching Parameter Suggestions')
          }
        })
      } else {
        resolve()
      }
    })
    return promise
  }

  addQuestion (data) {
    var promise = new Promise((resolve, reject) => {
      this.qstn.emit('create', data, (err) => {
        if (!err) {
          resolve('Question Submitted!')
        } else {
          reject('Error Submitting Question!')
        }
      })
    })
    return promise
  }
}

// Export a singleton instance of our client side api
let _NemoApi = new NemoApi()
export default _NemoApi
