// src/main.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Admin/LoginPage';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeePage from './pages/Admin/Employee';
import PayrollList from './pages/Admin/PayrollList';
import LeavesList from './pages/Admin/LeavesList';
import EmployeeProfile from './pages/Employee/EmployeeProfile';
import LeaveApplication from './pages/Employee/LeaveApplication';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employee_dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee_profile" element={<EmployeeProfile />} />
        <Route path="/apply-leave" element={<LeaveApplication />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/payroll" element={<PayrollList />} />
        <Route path="/leaves" element={<LeavesList />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
