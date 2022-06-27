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

  type: {
    type: 'int',
    label: 'Type',

    options: [{ value: 'value', label: 'value' }],
  },

  category: {
    type: 'int',
    label: 'Category',

    options: [{ value: 'value', label: 'value' }],
  },

  website: {
    type: 'string',
    label: 'Website',

    options: [{ value: 'value', label: 'value' }],
  },

  city: {
    type: 'string',
    label: 'City',

    options: [{ value: 'value', label: 'value' }],
  },

  link1: {
    type: 'string',
    label: 'Link 1',

    options: [{ value: 'value', label: 'value' }],
  },

  link2: {
    type: 'string',
    label: 'Link 2',

    options: [{ value: 'value', label: 'value' }],
  },

  link3: {
    type: 'string',
    label: 'Link 3',

    options: [{ value: 'value', label: 'value' }],
  },

  link4: {
    type: 'string',
    label: 'Link 4',

    options: [{ value: 'value', label: 'value' }],
  },

  user: {
    type: 'relation_many',
    label: 'User',

    options: [{ value: 'value', label: 'value' }],
  },

  products: {
    type: 'relation_many',
    label: 'Products',

    options: [{ value: 'value', label: 'value' }],
  },

  nodes: {
    type: 'relation_many',
    label: 'Nodes',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default meetupsFields;
