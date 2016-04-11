// ------------------------------------
// Constants
// ------------------------------------
export const SET_USER_QUESTIONS = 'SET_USER_QUESTIONS';

// ------------------------------------
// Actions
// ------------------------------------
export const setUserQuestions = (data) => {
  return {
    type: SET_USER_QUESTIONS,
    payload: data
  };
};

export const actions = {
  setUserQuestions
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_USER_QUESTIONS]: (state, action) => {
    return {
      userQuestions: action.payload
    };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  userQuestions: []
};

export default function nemoQuestionsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
