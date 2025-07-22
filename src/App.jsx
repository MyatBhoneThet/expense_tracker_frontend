import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Incomes from './components/Incomes'
import Expenses from './components/Expenses'
import ViewHistory from './components/ViewHistory'

// export default function App() {
//     return (
//         <div className="flex">
//             <Sidebar />
//             <div className="flex-1 ml-60 p-6">
//                 <Routes>
//                     <Route path="/" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/incomes" element={<Incomes />} />
//                     <Route path="/expenses" element={<Expenses />} />
//                     <Route path="/viewhistory" element={<ViewHistory />} />
//                     {/* Example redirect */}
//                     <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//             </div>
//         </div>
//     );
// }

import PrivateRoute from './components/PrivateRoute'

export default function App() {
    const location = useLocation();
    const hideSidebarPaths = ['/', '/register']; // pages where Sidebar should be hidden

    const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

    return (
        <div className="flex">
            {!shouldHideSidebar && (
                <div className='fixed'>
                    <Sidebar />
                </div>
            )}
            <div className={shouldHideSidebar ? "flex-1 p-6 mx-auto" : "flex-1 ml-60 p-6"}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/incomes" 
                        element={
                            <PrivateRoute>
                                <Incomes />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/expenses" 
                        element={
                            <PrivateRoute>
                                <Expenses />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/viewhistory" 
                        element={
                            <PrivateRoute>
                                <ViewHistory />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}
