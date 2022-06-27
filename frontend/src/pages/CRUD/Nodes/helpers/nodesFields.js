const nodesFields = {
  id: { type: 'id', label: 'ID' },

  macaroon: {
    type: 'string',
    label: 'Macaroon',

    options: [{ value: 'value', label: 'value' }],
  },

  api_endpoint: {
    type: 'string',
    label: 'Api Endpoint',

    options: [{ value: 'value', label: 'value' }],
  },

  type: {
    type: 'int',
    label: 'Type',

    options: [{ value: 'value', label: 'value' }],
  },

  Meetup: {
    type: 'relation_one',
    label: 'Meetup',

    options: [{ value: 'value', label: 'value' }],
  },

  node_name: {
    type: 'string',
    label: 'Node Name',

    options: [{ value: 'value', label: 'value' }],
  },

  node_id: {
    type: 'string',
    label: 'Node Id',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default nodesFields;
