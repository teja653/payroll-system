// src/components/LeavesList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styles from '../../styles/Admin/LeavesList.module.css';
import Sidebar from './AdminSidebar';

const LeavesList = () => {
    const [leaves, setLeaves] = useState([]);

    // Fetch leave data on component mount
    useEffect(() => {
        fetchLeaves();
    }, []);

    // Function to fetch leave records from the backend
    const fetchLeaves = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leaves');
            setLeaves(response.data);
        } catch (error) {
            console.error("Error fetching leaves data:", error);
        }
    };

    // Function to update leave status
    const updateLeaveStatus = async (leaveId, newStatus) => {
        try {
            await axios.post('http://localhost:5000/api/leaves/update_status', {
                leave_id: leaveId,
                status: newStatus
            });
            alert("Leave status updated successfully");
            fetchLeaves(); // Reload the leaves data after updating status
        } catch (error) {
            console.error("Error updating leave status:", error);
            alert("Failed to update leave status");
        }
    };

    // Custom styling function for react-select
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: '150px', 
        }),

        control: (provided, state) => {
            const selectedValue = state.getValue()[0]?.value;
            let backgroundColor;

            switch (selectedValue) {
                case 'Pending':
                    backgroundColor = '#FFC934';
                    break;
                case 'Approved':
                    backgroundColor = '#4E9C44';
                    break;
                case 'Rejected':
                    backgroundColor = '#DB2B39';
                    break;
                default:
                    backgroundColor = '#f8f9fa'; // Default background color
            }

            return {
                ...provided,
                backgroundColor,
                color: '#222',
                borderColor: '#fff',
                boxShadow: state.isFocused ? '0 0 0 1px #3496C0' : undefined,
            };
        },
        singleValue: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#fff', // Change the arrow color
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: '#fff', // Change this color to whatever you want the line to be
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999, // Ensure the dropdown is above other content
        }),
    };

    const options = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
    ];

    return (
        <div className={styles.Leavescontainer}>
            <Sidebar/>
            <div className={styles.leavesList}>
            <h1>Leaves Management</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map((leave) => (
                        <tr key={leave.leave_id}>
                            <td>{leave.employee_id}</td>
                            <td>{leave.employee_name}</td>
                            <td>{leave.leave_type}</td>
                            <td>{leave.start_date}</td>
                            <td>{leave.end_date}</td>
                            <td>{leave.reason}</td>
                            <td>
                            <Select
                                        options={options}
                                        value={options.find(option => option.value === leave.status)}
                                        onChange={(newStatus) => updateLeaveStatus(leave.leave_id, newStatus.value)}
                                        styles={customStyles}
                                        menuPortalTarget={document.body} // Ensure dropdown renders in the body
                                        menuPosition="fixed" // Helps with positioning
                                        isSearchable={false}
                                    />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default LeavesList;
