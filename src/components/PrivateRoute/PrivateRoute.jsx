import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return userData ? <Outlet /> : <Navigate to="/" />;
}