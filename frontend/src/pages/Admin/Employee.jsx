// src/pages/Employee.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './EmployeeList';
import AddEmployeeForm from './AddEmployeeForm';
import styles from '../../styles/Admin/Employee.module.css';
import Sidebar from './AdminSidebar';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeAdded = () => {
    fetchEmployees();       // re-fetch from DB so new employee appears
    setShowForm(false);    // auto-hide the form after successful add
  };

  return (
    <div className={styles.employeePageContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <h1>Employee Management</h1>
        {/* Pass employees list AND delete callback so child always reflects DB state */}
        <EmployeeList
          employees={employees}
          onEmployeeDeleted={fetchEmployees}
        />
        <button onClick={() => setShowForm(!showForm)} className={styles.toggleButton}>
          {showForm ? 'Hide Form' : 'Add New Employee'}
        </button>
        {showForm && (
          <AddEmployeeForm onEmployeeAdded={handleEmployeeAdded} />
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
