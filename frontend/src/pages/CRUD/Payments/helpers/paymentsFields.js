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

  amount: {
    type: 'int',
    label: 'Amount',

    options: [{ value: 'value', label: 'value' }],
  },

  amount_sats: {
    type: 'int',
    label: 'Amount Sats',

    options: [{ value: 'value', label: 'value' }],
  },

  meetup_to: {
    type: 'relation_many',
    label: 'Meetup To',

    options: [{ value: 'value', label: 'value' }],
  },

  meetup_from: {
    type: 'relation_one',
    label: 'Meetup From',

    options: [{ value: 'value', label: 'value' }],
  },

  product: {
    type: 'relation_many',
    label: 'Product',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default paymentsFields;
