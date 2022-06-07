import list from 'reducers/channels/channelsListReducers';
import form from 'reducers/channels/channelsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
