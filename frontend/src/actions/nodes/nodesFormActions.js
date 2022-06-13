import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'NODES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'NODES_FORM_FIND_STARTED',
      });

      axios.get(`/nodes/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'NODES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'NODES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/nodes'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'NODES_FORM_CREATE_STARTED',
      });
      console.log("here3")
      axios.post('/nodes', { data: values }).then((res) => {
        dispatch({
          type: 'NODES_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Nodes created' });
        dispatch(push('/admin/nodes'));
      });
      console.log("here5")
    } catch (error) {
      console.log("here4")
      Errors.handle(error);

      dispatch({
        type: 'NODES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'NODES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/nodes/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'NODES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Nodes updated' });
        dispatch(push('/admin/nodes'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'NODES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
