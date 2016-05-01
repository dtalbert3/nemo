import * as questions from './redux/modules/nemoQuestions'
import * as questionCreator from './redux/modules/questionCreator'

import config from './config'
import io from 'socket.io-client'

class NemoApi {

  constructor (store = null) {
    this.store = store

    this.dash = io.connect(config.apiUrl + '/dash')
    this.qstn = io.connect(config.apiUrl + '/qstn')
    this.user = io.connect(config.apiUrl + '/user')
  }

  setStore (store) {
    this.store = store
  }

  signup (userData) {
    var promise = new Promise((resolve, reject) => {
      this.user.emit('signup', userData, (error, msg) => {
        if (!error) {
          resolve(msg)
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  fetchGlobalData () {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('getGlobal', {}, (error, data) => {
        if (!error) {
          data = JSON.parse(data).filter((d) => {
            return parseInt(localStorage.getItem('userID')) !== d.UserID
          })
          this.store.dispatch(questions.setGlobalQuestions(data))
          resolve('Fetched Global Questions')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  fetchUserData () {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('getUser', localStorage.userID, {}, (error, data) => {
        if (!error) {
          data = JSON.parse(data)
          this.store.dispatch(questions.setUserQuestions(data))
          resolve('Fetched User Questions')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  deleteQuestion (id) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('delete', id, (error) => {
        if (!error) {
          resolve('Question Deleted')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  giveFeedback (params) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('feedback', params, (error) => {
        if (!error) {
          resolve('Feedback Received')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  getTypes () {
    var promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem('questionTypes') === null) {
        this.qstn.emit('getTypes', (error, data) => {
          if (!error) {
            data = data.map((d) => d)
            this.store.dispatch(questionCreator.setQuestionTypes(data))
            resolve('Fetched Question Types')
          } else {
            reject(error)
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
        this.qstn.emit('getEvents', (error, data) => {
          if (!error) {
            data = data.map((d) => d)
            this.store.dispatch(questionCreator.setQuestionEvents(data))
            resolve('Fetched Question Events')
          } else {
            reject(error)
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
        this.qstn.emit('getSuggestions', (error, data) => {
          if (!error) {
            this.store.dispatch(questionCreator.setQuestionSuggestions(data))
            resolve('Fetched Parameter Suggestions')
          } else {
            reject(error)
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
      this.qstn.emit('create', data, (error) => {
        if (!error) {
          resolve('Question Submitted!')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  copyQuestion (params) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('copyQuestion',  params, (error) => {
        if (!error) {
          resolve('Question copied to your dashboard!')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  editPatient (id, data) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('editPatient', id, JSON.stringify(data), (error) => {
        if (!error) {
          resolve('Patient Edited!')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  editAlgorithm (id, data) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('editAlgorithm', id, data, (error) => {
        if (!error) {
          resolve('Algorithm Edited!')
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

  markPrediction (id, mark) {
    var promise = new Promise((resolve, reject) => {
      this.dash.emit('markPrediction', id, mark, (error, success) => {
        if (!error) {
          resolve(success)
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

}

// Export a singleton instance of our client side api
let _NemoApi = new NemoApi()

export default _NemoApi
