// src/pages/EmployeeList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Admin/Employee.module.css';

// employees and onEmployeeDeleted come from the parent (Employee.jsx)
// so the parent always controls the master list from the DB
const EmployeeList = ({ employees = [], onEmployeeDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(null); // { text, type: 'success'|'error' }
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (emp) => {
    setEditId(emp.employee_id);
    setEditFormData({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      phone_number: emp.phone_number,
      address: emp.address,
      department: emp.department,
      role: emp.role,
      status: emp.status,
      salary: emp.salary,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (employee_id) => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${employee_id}`, editFormData);
      setMessage({ text: 'Employee updated successfully.', type: 'success' });
      setEditId(null);
      if (onEmployeeDeleted) onEmployeeDeleted(); // Re-fetch the list
    } catch (error) {
      console.error('Error updating employee:', error);
      setMessage({ text: 'Failed to update employee.', type: 'error' });
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDeleteEmployee = async (employee_id, fullName) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fullName}"?\n` +
      `This will also remove their payroll, leaves, payslips and login account.`
    );
    if (!confirmed) return;

    setDeletingId(employee_id);
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employee_id}`);
      setMessage({ text: `"${fullName}" has been deleted successfully.`, type: 'success' });
      // Tell parent to re-fetch so the list reflects the DB state
      if (onEmployeeDeleted) onEmployeeDeleted();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setMessage({ text: `Failed to delete "${fullName}". Please try again.`, type: 'error' });
    } finally {
      setDeletingId(null);
      // Auto-clear the message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className={styles.employeeList}>
      {/* Status banner shown after delete attempt */}
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

      <table className={styles.employeeTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Salary</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              {editId === emp.employee_id ? (
                <>
                  <td><input type="text" name="first_name" value={editFormData.first_name || ''} onChange={handleEditChange} style={{ width: '80px' }} /></td>
                  <td><input type="text" name="last_name" value={editFormData.last_name || ''} onChange={handleEditChange} style={{ width: '80px' }} /></td>
                  <td><input type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} style={{ width: '120px' }} /></td>
                  <td><input type="text" name="phone_number" value={editFormData.phone_number || ''} onChange={handleEditChange} style={{ width: '90px' }} /></td>
                  <td><input type="text" name="address" value={editFormData.address || ''} onChange={handleEditChange} style={{ width: '100px' }} /></td>
                  <td><input type="text" name="department" value={editFormData.department || ''} onChange={handleEditChange} style={{ width: '90px' }} /></td>
                  <td><input type="text" name="role" value={editFormData.role || ''} onChange={handleEditChange} style={{ width: '80px' }} /></td>
                  <td>
                    <select name="status" value={editFormData.status || ''} onChange={handleEditChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td><input type="number" name="salary" value={editFormData.salary || ''} onChange={handleEditChange} style={{ width: '80px' }} /></td>
                  <td>{emp.hire_date}</td>
                  <td>
                    <button style={{ marginRight: '5px', backgroundColor: '#28a745' }} onClick={() => handleSaveEdit(emp.employee_id)}>Save</button>
                    <button style={{ backgroundColor: '#6c757d' }} onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone_number}</td>
                  <td>{emp.address}</td>
                  <td>{emp.department}</td>
                  <td>{emp.role}</td>
                  <td>{emp.status}</td>
                  <td>₹{emp.salary}</td>
                  <td>{emp.hire_date}</td>
                  <td>
                    <button
                      style={{ marginRight: '5px', paddingRight: '30px', backgroundColor: '#007bff' }}
                      onClick={() => handleEditClick(emp)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteEmployee(
                          emp.employee_id,
                          `${emp.first_name} ${emp.last_name}`
                        )
                      }
                      disabled={deletingId === emp.employee_id}
                      style={{ opacity: deletingId === emp.employee_id ? 0.6 : 1 }}
                    >
                      {deletingId === emp.employee_id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;