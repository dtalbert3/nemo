// ------------------------------------
// Constants
// ------------------------------------
export const SET_USER_QUESTIONS = 'SET_USER_QUESTIONS'
export const SET_GLOBAL_QUESTIONS = 'SET_GLOBAL_QUESTIONS'

// ------------------------------------
// Actions
// ------------------------------------
export const setUserQuestions = (data) => {
  return {
    type: SET_USER_QUESTIONS,
    payload: data
  }
}

export const setGlobalQuestions = (data) => {
  return {
    type: SET_GLOBAL_QUESTIONS,
    payload: data
  }
}

export const actions = {
  setUserQuestions,
  setGlobalQuestions
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_USER_QUESTIONS]: (state, action) => {
    return {
      userQuestions: action.payload,
      globalQuestions: state.globalQuestions
    }
  },
  [SET_GLOBAL_QUESTIONS]: (state, action) => {
    return {
      userQuestions: state.userQuestions,
      globalQuestions: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  userQuestions: [],
  globalQuestions: []
}

export default function nemoQuestionsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
