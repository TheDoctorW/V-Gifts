import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../AuthContext';

export default function ProtectedRoute(props) {
  const token = React.useContext(AuthContext).user;
  console.log(token);
  if (!token) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
}
