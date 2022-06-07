import list from 'reducers/meetups/meetupsListReducers';
import form from 'reducers/meetups/meetupsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
