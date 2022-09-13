import { FETCH_PERSON_DATA } from '../actions/person';

const initialState = {
  userInfo: {},
};

export default (state = initialState, action) => {
  switch (action?.type) {
    case FETCH_PERSON_DATA:
      return action?.payload;
    default:
      return state;
  }
};
