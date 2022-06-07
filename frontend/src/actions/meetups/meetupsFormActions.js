import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'MEETUPS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'MEETUPS_FORM_FIND_STARTED',
      });

      axios.get(`/meetups/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'MEETUPS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MEETUPS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/meetups'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'MEETUPS_FORM_CREATE_STARTED',
      });

      axios.post('/meetups', { data: values }).then((res) => {
        dispatch({
          type: 'MEETUPS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Meetups created' });
        dispatch(push('/admin/meetups'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MEETUPS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'MEETUPS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/meetups/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'MEETUPS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Meetups updated' });
        dispatch(push('/admin/meetups'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MEETUPS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
