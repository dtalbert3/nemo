import Bloodhound from 'bloodhound-js'

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
    return {
      questionTypes: action.payload,
      questionEvents: state.questionEvents,
      demographics: state.demographics,
      suggestions: state.questionEvents,
      searchEngine: state.searchEngine
    }
  },
  [SET_QUESTION_EVENTS]: (state, action) => {
    return {
      questionTypes: state.questionTypes,
      questionEvents: action.payload,
      demographics: state.demographics,
      suggestions: state.suggestions,
      searchEngine: state.searchEngine
    }
  },
  [SET_QUESTIONS_SUGGESTIONS]: (state, action) => {
    state.searchEngine.clear()
    state.searchEngine.add(action.payload)
    return {
      questionTypes: state.questionTypes,
      questionEvents: state.questionEvents,
      demographics: state.demographics,
      suggestions: action.payload,
      searchEngine: state.searchEngine
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  questionTypes: [],
  questionEvents: [],
  suggestions: [],
  demographics: [{Name:'Sex', items: [{Name:'M'}, {Name: 'F'}]}, {Name:'Race', items: [{Name:'Black'}, {Name:'White'}]}, {Name:'Age'}],
  searchEngine: new Bloodhound({
    local: [],
    identify: (d) => d['concept_cd'],
    queryTokenizer: (data) => {
      return Bloodhound.tokenizers.whitespace(data)
    },
    datumTokenizer: (d) => {
      var tokens = []
      var stringSize = d['concept_cd'].length
      for (var size = 1; size <= stringSize; size++) {
        for (var i = 0; i + size <= stringSize; i++) {
          tokens.push(d['concept_cd'].substr(i, size))
        }
      }
      return tokens
    }
  })
}

export default function nemoQuestionsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
