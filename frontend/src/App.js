import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './axios';

import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterStepperPage from './pages/RegisterStepperPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

// https://material.io/resources/color/#!/?view.left=0&view.right=0&secondary.color=2196F3&secondary.text.color=FAFAFA&primary.color=FFC400
const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#fff64f',
			main: '#ffc400',
			dark: '#c79400',
			contrastText: '#000000',
    },
		secondary: {
      light: '#6ec6ff',
      main: '#2196f3',
      dark: '#0069c0',
      contrastText: '#fafafa',
		},
	},
});


function App() {
	// using hooks here to set state for the App
  // eslint-disable-next-line
	const [authDetails, setAuthDetails] = React.useState(
    // localStorage.getItem('token')
		localStorage.getItem('token')
	);

  // eslint-disable-next-line
  const [adminDetails, setAdminDetails] = React.useState(
    localStorage.getItem('admin_token')
  );


	// define a function to store details into local storage
	const setAuth = (token, id) => {
		localStorage.setItem('token', token);
		localStorage.setItem('id', id);

		// setAuthDetails(token);
    setAuthDetails(token);
	};

  const setAdminAuth = (token, id) => {
    localStorage.setItem('admin_token', token);
		localStorage.setItem('admin_id', id);

    setAdminDetails(token);
  };
	
  return (
			<ThemeProvider theme={theme}>
				<AuthProvider value={{user: authDetails, admin: adminDetails}}>
          <Router>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route 
                exact 
                path="/login"
                render={(props) => {
                  return <LoginPage {...props} setAuth={setAuth} />;
                }} 
              />
              <Route 
                exact 
                path="/register" 
                render={(props) => {
                  return <RegisterStepperPage {...props} setAuth={setAuth} />;
                }}  
              />
              <Route 
                exact 
                path="/admin/login" 
                render={(props) => {
                  return <AdminLoginPage {...props} setAdminAuth={setAdminAuth} />;
                }} 
              />
              <Route 
                path="/products" 
                component={ProductsPage}
                // render={(props) => {
                //   return <ProductsPage {...props} key={window.location.pathname} />
                // }}
              />
              <Route exact path="/product/:id" component={ProductDetailPage} />
              <ProtectedRoute exact path="/profile/:id" component={ProfilePage} />
              <ProtectedRoute exact path="/profile/:id/cart" component={CartPage} />
              <AdminRoute exact path="/admin/:token" component={AdminPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </AuthProvider>
			</ThemeProvider>
	);
}

export default App;
