// wrapper that redirects if no JWT token found

import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to="/login" />
}
