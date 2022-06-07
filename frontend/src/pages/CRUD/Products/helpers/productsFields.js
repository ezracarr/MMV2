const productsFields = {
  id: { type: 'id', label: 'ID' },

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

  price: {
    type: 'string',
    label: 'Price',

    options: [{ value: 'value', label: 'value' }],
  },

  meetup: {
    type: 'relation_one',
    label: 'Meetup',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default productsFields;
