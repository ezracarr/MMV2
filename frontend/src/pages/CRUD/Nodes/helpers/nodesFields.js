const nodesFields = {
  id: { type: 'id', label: 'ID' },

  macaroon: {
    type: 'string',
    label: 'Macaroon',

    options: [{ value: 'value', label: 'value' }],
  },
  meetup: {
    type: 'relation_one',
    label: 'Meetup',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default nodesFields;
