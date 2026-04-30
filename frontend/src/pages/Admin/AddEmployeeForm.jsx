// src/pages/AddEmployeeForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Admin/Employee.module.css';

const AddEmployeeForm = ({ onEmployeeAdded }) => {
  const [message, setMessage] = useState(null); // { text, type: 'success'|'error' }
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    department: '',
    role: '',  // Employee role (job position)
    status: '',
    salary: '',
    hire_date: '',
    username: '',
    password: '',
    user_role: 'employee',  // User role (access control)
    basic_salary: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "basic_salary" && { salary: value }) // Sets both basic_salary and salary if input name is "basic_salary"
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post('http://localhost:5000/api/employees', formData);
      setMessage({ text: `Employee "${formData.first_name} ${formData.last_name}" added successfully!`, type: 'success' });
      // Reset the form fields
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        department: '',
        role: '',
        status: '',
        salary: '',
        hire_date: '',
        username: '',
        password: '',
        user_role: 'employee',
        basic_salary: ''
      });
      // Tell parent: re-fetch list and hide form
      if (onEmployeeAdded) onEmployeeAdded();
    } catch (error) {
      console.error('Error adding employee:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to add employee. Please try again.';
      setMessage({ text: errMsg, type: 'error' });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>Add New Employee</h3>

      {/* Status banner */}
      {message && (
        <div
          style={{
            padding: '10px 16px',
            marginBottom: '12px',
            borderRadius: '6px',
            fontWeight: '600',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        {/* New User Fields */}
        <div className={styles.formGroup}>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>User Role</label>
          <select name="user_role" value={formData.user_role} onChange={handleChange} required>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Department</label>
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Production and Operations">Production and Operations</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing and Sales">Marketing and Sales</option>
            <option value="Research and Development">Research and Development</option>
            <option value="Customer Service">Customer Service</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Designation</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        {/* <div className={styles.formGroup}>
          <label>Basic Salary</label>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
        </div> */}

        {/* Payroll Fields */}
        <div className={styles.formGroup}>
          <label>Basic Salary</label>
          <input type="number" name="basic_salary" value={formData.basic_salary} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Hire Date</label>
          <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} required />
        </div>
        <div className={styles.formButtonContainer}>
          <button type="submit" className={styles.submitButton}>Add Employee</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;