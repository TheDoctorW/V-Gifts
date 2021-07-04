import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../AuthContext';

export default function AdminRoute(props) {
  const token = React.useContext(AuthContext).admin;
  console.log(token);
  if (!token) {
    return <Redirect to="/admin/login" />;
  }
  return <Route {...props} />;
}
