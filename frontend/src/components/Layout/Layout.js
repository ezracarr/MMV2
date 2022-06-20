import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from '../Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';

import EditUser from '../../pages/user/EditUser';

// pages
import Dashboard from '../../pages/dashboard';
import BreadCrumbs from '../../components/BreadCrumbs';

// context
import { useLayoutState } from '../../context/LayoutContext';

import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

import MeetupsFormPage from 'pages/CRUD/Meetups/form/MeetupsFormPage';
import MeetupsTablePage from 'pages/CRUD/Meetups/table/MeetupsTablePage';

import NodesFormPage from 'pages/CRUD/Nodes/form/NodesFormPage';
import NodesTablePage from 'pages/CRUD/Nodes/table/NodesTablePage';

import ProductsFormPage from 'pages/CRUD/Products/form/ProductsFormPage';
import ProductsTablePage from 'pages/CRUD/Products/table/ProductsTablePage';

import PaymentsFormPage from 'pages/CRUD/Payments/form/PaymentsFormPage';
import PaymentsTablePage from 'pages/CRUD/Payments/table/PaymentsTablePage';

import EventsFormPage from 'pages/CRUD/Events/form/EventsFormPage';
import EventsTablePage from 'pages/CRUD/Events/table/EventsTablePage';

const Redirect = (props) => {
  useEffect(() => window.location.replace(props.url));
  return <span>Redirecting...</span>;
};

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Switch>
          <Route path='/admin/dashboard' component={Dashboard} />
          <Route path='/admin/user/edit' component={EditUser} />
          <Route
            path={'/admin/api-docs'}
            exact
            component={(props) => (
              <Redirect
                url={
                  process.env.NODE_ENV === 'production'
                    ? window.location.origin + '/api-docs'
                    : 'http://localhost:8080/api-docs'
                }
                {...props}
              />
            )}
          />

          <Route path={'/admin/users'} exact component={UsersTablePage} />
          <Route path={'/admin/users/new'} exact component={UsersFormPage} />
          <Route
            path={'/admin/users/:id/edit'}
            exact
            component={UsersFormPage}
          />

          <Route path={'/admin/meetups'} exact component={MeetupsTablePage} />
          <Route
            path={'/admin/meetups/new'}
            exact
            component={MeetupsFormPage}
          />
          <Route
            path={'/admin/meetups/:id/edit'}
            exact
            component={MeetupsFormPage}
          />

          <Route path={'/admin/nodes'} exact component={NodesTablePage} />
          <Route path={'/admin/nodes/new'} exact component={NodesFormPage} />
          <Route
            path={'/admin/nodes/:id/edit'}
            exact
            component={NodesFormPage}
          />

          <Route path={'/admin/products'} exact component={ProductsTablePage} />
          <Route
            path={'/admin/products/new'}
            exact
            component={ProductsFormPage}
          />
          <Route
            path={'/admin/products/:id/edit'}
            exact
            component={ProductsFormPage}
          />

          <Route path={'/admin/payments'} exact component={PaymentsTablePage} />
          <Route
            path={'/admin/payments/new'}
            exact
            component={PaymentsFormPage}
          />
          <Route
            path={'/admin/payments/:id/edit'}
            exact
            component={PaymentsFormPage}
          />

          <Route path={'/admin/events'} exact component={EventsTablePage} />
          <Route path={'/admin/events/new'} exact component={EventsFormPage} />
          <Route
            path={'/admin/events/:id/edit'}
            exact
            component={EventsFormPage}
          />
        </Switch>
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/'}
              target={'_blank'}
              className={classes.link}
            >
              Flatlogic
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/about'}
              target={'_blank'}
              className={classes.link}
            >
              About Us
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/blog'}
              target={'_blank'}
              className={classes.link}
            >
              Blog
            </Link>
          </div>
          <div>
            <Link href={'https://www.facebook.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='facebook'>
                <FacebookIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://twitter.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='twitter'>
                <TwitterIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://github.com/flatlogic'} target={'_blank'}>
              <IconButton
                aria-label='github'
                style={{ padding: '12px 0 12px 12px' }}
              >
                <GithubIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

export default withRouter(connect()(Layout));
