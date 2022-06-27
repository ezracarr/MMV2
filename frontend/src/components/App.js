import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from './Snackbar';
import { Close as CloseIcon } from '@mui/icons-material';
import useStyles from './styles';
// components
import Layout from './Layout';
import NoAuthLayout from './NoAuthLayout';
import Documentation from './Documentation/Documentation';

// pages
import Starter from '../pages/starter';
import Error from '../pages/error';
import Login from '../pages/login';
import Verify from '../pages/verify';
import Reset from '../pages/reset';

// context
import { useUserState } from '../context/UserContext';
import { getHistory } from '../index';

export default function App() {
  // global
  let { isAuthenticated } = useUserState();
  const isAuth = isAuthenticated();
  const classes = useStyles();
  function CloseButton({ closeToast, className }) {
    return <CloseIcon className={className} onClick={closeToast} />;
  }
  if (isAuth) {
    return (
      <>
        <SnackbarProvider>
          <ConnectedRouter history={getHistory()}>
            <Router history={getHistory()}>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/admin/dashboard' />}
                />
                <Route
                  exact
                  path='/admin'
                  render={() => <Redirect to='/admin/dashboard' />}
                />
                <Route path='/documentation' component={Documentation} />
                <PrivateRoute path='/admin' component={Layout} />
                <Redirect from='*' to='/admin/dashboard' />
                <Route component={Error} />
              </Switch>
            </Router>
          </ConnectedRouter>
        </SnackbarProvider>
      </>
    );
  } else {
    return (
      <>
        <SnackbarProvider>
          <ConnectedRouter history={getHistory()}>
            <Router history={getHistory()}>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/dashboard' />}
                />
                <PublicRoute path='/dashboard' component={NoAuthLayout} />
                <PublicRoute path='/login' component={Login} />
                <PublicRoute path='/verify-email' exact component={Verify} />
                <PublicRoute path='/password-reset' exact component={Reset} />
                <Redirect from='*' to='/dashboard' />
                <Route component={Error} />
              </Switch>
            </Router>
          </ConnectedRouter>
        </SnackbarProvider>
      </>
    );
  }


  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          React.createElement(component, props)
          // isAuth ? (
          //   React.createElement(component, props)
          // ) : (
          //   <Redirect to={'/starter'} />
          // )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
