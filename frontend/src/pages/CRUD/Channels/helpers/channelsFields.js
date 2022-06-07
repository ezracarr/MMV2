const channelsFields = {
  id: { type: 'id', label: 'ID' },

  partyA: {
    type: 'string',
    label: 'Party A',

    options: [{ value: 'value', label: 'value' }],
  },

  partyB: {
    type: 'string',
    label: 'Party B',

    options: [{ value: 'value', label: 'value' }],
  },

  partyA_local_balance: {
    type: 'string',
    label: 'Party A Local Balance',

    options: [{ value: 'value', label: 'value' }],
  },

  partyB_local_balance: {
    type: 'string',
    label: 'Party B Local Balance',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default channelsFields;
