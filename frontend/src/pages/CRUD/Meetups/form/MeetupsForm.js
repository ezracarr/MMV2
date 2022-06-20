import { Formik } from 'formik';
import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Loader from 'components/Loader';
// eslint-disable-next-line no-unused-vars
import InputFormItem from 'components/FormItems/items/InputFormItem';
// eslint-disable-next-line no-unused-vars
import SwitchFormItem from 'components/FormItems/items/SwitchFormItem';
// eslint-disable-next-line no-unused-vars
import RadioFormItem from 'components/FormItems/items/RadioFormItem';
// eslint-disable-next-line no-unused-vars
import SelectFormItem from 'components/FormItems/items/SelectFormItem';
// eslint-disable-next-line no-unused-vars
import DatePickerFormItem from 'components/FormItems/items/DatePickerFormItem';
// eslint-disable-next-line no-unused-vars
import ImagesFormItem from 'components/FormItems/items/ImagesFormItem';
// eslint-disable-next-line no-unused-vars
import FilesFormItem from 'components/FormItems/items/FilesFormItem';
// eslint-disable-next-line no-unused-vars

import meetupsFields from 'pages/CRUD/Meetups/helpers/meetupsFields';
import IniValues from 'components/FormItems/iniValues';
import PreparedValues from 'components/FormItems/preparedValues';
import FormValidations from 'components/FormItems/formValidations';
import Widget from 'components/Widget';

import UsersSelectItem from 'pages/CRUD/Users/helpers/UsersSelectItem';

import ProductsSelectItem from 'pages/CRUD/Products/helpers/ProductsSelectItem';

import NodesSelectItem from 'pages/CRUD/Nodes/helpers/NodesSelectItem';

const MeetupsForm = (props) => {
  const {
    isEditing,
    isProfile,
    findLoading,
    saveLoading,
    record,
    onSubmit,
    onCancel,
    modal,
  } = props;

  const iniValues = () => {
    return IniValues(meetupsFields, record || {});
  };

  const formValidations = () => {
    return FormValidations(meetupsFields, record || {});
  };

  const handleSubmit = (values) => {
    const { id, ...data } = PreparedValues(meetupsFields, values || {});
    onSubmit(id, data);
  };

  const title = () => {
    if (isProfile) {
      return 'Edit My Profile';
    }

    return isEditing ? 'Edit Meetups' : 'Add Meetups';
  };

  const renderForm = () => (
    <Widget title={<h4>{title()}</h4>} collapse close>
      <Formik
        onSubmit={handleSubmit}
        initialValues={iniValues()}
        validationSchema={formValidations()}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                <InputFormItem name={'name'} schema={meetupsFields} autoFocus />
              </Grid>

              <Grid item>
                <InputFormItem name={'location'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'lat'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'long'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'hasNode'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'type'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'category'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'website'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'city'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'link1'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'link2'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'link3'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <InputFormItem name={'link4'} schema={meetupsFields} />
              </Grid>

              <Grid item>
                <UsersSelectItem
                  name={'user'}
                  schema={meetupsFields}
                  showCreate={!modal}
                  multiple
                  form={form}
                />
              </Grid>

              <Grid item>
                <ProductsSelectItem
                  name={'products'}
                  schema={meetupsFields}
                  showCreate={!modal}
                  multiple
                  form={form}
                />
              </Grid>

              <Grid item>
                <NodesSelectItem
                  name={'nodes'}
                  schema={meetupsFields}
                  showCreate={!modal}
                  multiple
                  form={form}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} mt={2}>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={form.handleSubmit}
                >
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={form.handleReset}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Widget>
  );
  if (findLoading) {
    return <Loader />;
  }
  if (isEditing && !record) {
    return <Loader />;
  }
  return renderForm();
};
export default MeetupsForm;
