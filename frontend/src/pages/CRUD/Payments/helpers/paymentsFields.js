const paymentsFields = {
  id: { type: 'id', label: 'ID' },

  payer: {
    type: 'string',
    label: 'Payer',

    options: [{ value: 'value', label: 'value' }],
  },

  payee: {
    type: 'string',
    label: 'Payee',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default paymentsFields;
