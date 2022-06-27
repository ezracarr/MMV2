import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import meetups from 'reducers/meetups/meetupsReducers';

import nodes from 'reducers/nodes/nodesReducers';

import products from 'reducers/products/productsReducers';

import payments from 'reducers/payments/paymentsReducers';

import events from 'reducers/events/eventsReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    meetups,

    nodes,

    products,

    payments,

    events,
  });
