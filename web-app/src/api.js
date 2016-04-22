import * as questions from './redux/modules/nemoQuestions'
import * as questionCreator from './redux/modules/questionCreator'
import Alert from './partials/alert'

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
          resolve()
        } else {
          Alert('Error Fetching Questions', 'danger', 4 * 1000)
          reject()
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
          resolve()
        } else {
          Alert('Error Fetching Questions', 'danger', 4 * 1000)
          reject()
        }
      })
    })
    return promise
  }

  deleteQuestion (id) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('delete', id, (err) => {
        if (!err) {
          Alert('Question Deleted', 'success', 4 * 1000)
          resolve()
        } else {
          Alert('Error Deleting Questions', 'danger', 4 * 1000)
          reject()
        }
      })
    })
    return promise
  }

  giveFeedback (params) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('feedback', params, (err) => {
        if (!err) {
          Alert('Feedback Received', 'success', 4 * 1000)
          resolve()
        } else {
          Alert('Error Giving Feedback', 'danger', 4 * 1000)
          reject()
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
            resolve()
          } else {
            Alert('Error Fetching Question Types', 'danger', 4 * 1000)
            reject()
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
            resolve()
          } else {
            Alert('Error Fetching Question Events', 'danger', 4 * 1000)
            reject()
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
        this.qstn.emit('getSuggestions', (err, data) => {
          if (!err) {
            this.store.dispatch(questionCreator.setQuestionSuggestions(data))
            resolve()
          } else {
            Alert('Error Fetching Parameter Suggestions', 'danger', 4 * 1000)
            reject()
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
          Alert('Question Submitted!', 'success', 4 * 1000)
          resolve()
        } else {
          Alert('Error Submitting Question!', 'danger', 4 * 1000)
          reject()
        }
      })
    })
    return promise
  }
}

// Export a singleton instance of our client side api
let _NemoApi = new NemoApi()
export default _NemoApi
