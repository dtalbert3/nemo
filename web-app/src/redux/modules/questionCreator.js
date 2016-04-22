// ------------------------------------
// Constants
// ------------------------------------
export const SET_QUESTION_TYPES = 'SET_QUESTION_TYPES'
export const SET_QUESTION_EVENTS = 'SET_QUESTION_EVENTS'
export const SET_QUESTIONS_SUGGESTIONS = 'SET_QUESTIONS_SUGGESTIONS'

// ------------------------------------
// Actions
// ------------------------------------
export const setQuestionTypes = (data) => {
  return {
    type: SET_QUESTION_TYPES,
    payload: data
  }
}

export const setQuestionEvents = (data) => {
  return {
    type: SET_QUESTION_EVENTS,
    payload: data
  }
}

export const setQuestionSuggestions = (data) => {
  return {
    type: SET_QUESTIONS_SUGGESTIONS,
    payload: data
  }
}

export const actions = {
  setQuestionTypes,
  setQuestionEvents,
  setQuestionSuggestions
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_QUESTION_TYPES]: (state, action) => {
    sessionStorage.setItem('questionTypes', action.payload)
    return {
      questionTypes: action.payload,
      questionEvents: state.questionEvents,
      suggestions: state.questionEvents
    }
  },
  [SET_QUESTION_EVENTS]: (state, action) => {
    sessionStorage.setItem('questionEvents', action.payload)
    return {
      questionTypes: state.questionTypes,
      questionEvents: action.payload,
      suggestions: state.suggestions
    }
  },
  [SET_QUESTIONS_SUGGESTIONS]: (state, action) => {
    sessionStorage.setItem('suggestions', action.payload)
    return {
      questionTypes: state.questionTypes,
      questionEvents: state.questionEvents,
      suggestions: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  questionTypes: [],
  questionEvents: [],
  suggestions: []
}

export default function nemoQuestionsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
