const meetupsFields = {
  id: { type: 'id', label: 'ID' },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  location: {
    type: 'string',
    label: 'Location',

    options: [{ value: 'value', label: 'value' }],
  },

  lat: {
    type: 'string',
    label: 'Lat',

    options: [{ value: 'value', label: 'value' }],
  },

  long: {
    type: 'string',
    label: 'Long',

    options: [{ value: 'value', label: 'value' }],
  },

  hasNode: {
    type: 'string',
    label: 'Has Node',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default meetupsFields;
