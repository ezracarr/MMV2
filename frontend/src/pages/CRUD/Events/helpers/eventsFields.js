const eventsFields = {
  id: { type: 'id', label: 'ID' },

  date: {
    type: 'datetime',
    label: 'Date',

    options: [{ value: 'value', label: 'value' }],
  },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  description: {
    type: 'string',
    label: 'Description',

    options: [{ value: 'value', label: 'value' }],
  },

  meetup: {
    type: 'relation_one',
    label: 'Meetup',

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

  lng: {
    type: 'string',
    label: 'Lng',

    options: [{ value: 'value', label: 'value' }],
  },

  city: {
    type: 'string',
    label: 'City',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default eventsFields;
