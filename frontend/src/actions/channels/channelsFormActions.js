import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'CHANNELS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'CHANNELS_FORM_FIND_STARTED',
      });

      axios.get(`/channels/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'CHANNELS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CHANNELS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/channels'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'CHANNELS_FORM_CREATE_STARTED',
      });

      axios.post('/channels', { data: values }).then((res) => {
        dispatch({
          type: 'CHANNELS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Channels created' });
        dispatch(push('/admin/channels'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CHANNELS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'CHANNELS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/channels/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'CHANNELS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Channels updated' });
        dispatch(push('/admin/channels'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CHANNELS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
