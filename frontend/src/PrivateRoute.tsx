import React from 'react';
import { Route } from 'react-router-dom';

const PrivateRoute: React.FC<{
  path: string;
  element: React.ReactElement;
}> = ({ path, element }) => {
  console.log('PrivateRoute rendered', { path, element }); // Log the props

  return (
    <Route path={path} element={element} />
  );
};

export default PrivateRoute;