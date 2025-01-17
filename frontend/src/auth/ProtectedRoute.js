import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ userId }) => {
  return userId ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
