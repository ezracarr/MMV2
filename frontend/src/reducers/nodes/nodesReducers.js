import list from 'reducers/nodes/nodesListReducers';
import form from 'reducers/nodes/nodesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
