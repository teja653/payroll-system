// src/pages/PayrollList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Admin/PayrollList.module.css';
import Sidebar from './AdminSidebar';

const PayrollList = () => {
  const [payrollData, setPayrollData] = useState([]);
  // State to hold the manual inputs for each row, keyed by payroll_id
  const [manualData, setManualData] = useState({});

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payroll');
        setPayrollData(response.data);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayrollData();
  }, []);

  // Handler to update manual input fields
  const handleInputChange = (payrollId, field, value) => {
    setManualData((prev) => ({
      ...prev,
      [payrollId]: {
        ...prev[payrollId],
        [field]: value,
      },
    }));
  };

  const handlePayslipAction = async (payrollId, mode) => {
    if (mode === 'generate') {
      try {
        console.log(`Generating payslip for payroll ID: ${payrollId}`);

        // Find the current item to use as a fallback for unmodified fields
        const currentItem = payrollData.find(p => p.payroll_id === payrollId) || {};
        const rowData = manualData[payrollId] || {};

        // Build payload: use manual data if entered, otherwise fallback to existing DB data
        const payload = {
          leave_deductions: rowData.leaveDeductions !== undefined ? Number(rowData.leaveDeductions) : (Number(currentItem.leave_deductions) || 0),
          pf_deductions: rowData.pfDeductions !== undefined ? Number(rowData.pfDeductions) : (Number(currentItem.pf_deductions) || 0),
          incentives: rowData.incentives !== undefined ? Number(rowData.incentives) : (Number(currentItem.incentives) || 0),
          pay_from_date: rowData.payFromDate !== undefined ? rowData.payFromDate : (currentItem.pay_from_date || null),
          pay_date: rowData.payDate !== undefined ? rowData.payDate : (currentItem.pay_date || null)
        };

        // Send the payload to the backend
        const response = await axios.post(
          `http://localhost:5000/api/payroll/generate_payslip/${payrollId}`,
          payload
        );

        alert(response.data.message);

        // Clear the manual inputs for this specific row so it returns to "Download" mode
        setManualData((prev) => {
          const newState = { ...prev };
          delete newState[payrollId];
          return newState;
        });

        // Refresh table data
        const refreshedData = await axios.get('http://localhost:5000/api/payroll');
        setPayrollData(refreshedData.data);

      } catch (error) {
        console.error("Error generating payslip:", error);
        alert("Failed to generate payslip");
      }
    } else if (mode === 'download') {
      try {
        const response = await axios.get(`http://localhost:5000/api/payroll/download_payslip/${payrollId}`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Payslip_${payrollId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading payslip:", error);
        alert("Failed to download payslip");
      }
    }
  };

  return (
    <div className={styles.payrollListContainer}>
      <Sidebar />
      <h1 className={styles.payrollHeader}>Payroll List</h1>
      <div className={styles.payrollList}>
        <table className={styles.payrollTable}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Net Salary</th>
              <th>Pay From Date</th>
              <th>Incentives</th>
              <th>Leave Deductions</th>
              <th>PF Deductions</th>
              <th>Pay Date</th>
              <th>Payslip</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((item, index) => {
              const rowData = manualData[item.payroll_id] || {};

              // Determine display values (User input takes priority over database value)
              const payFromDateVal = rowData.payFromDate !== undefined ? rowData.payFromDate : (item.pay_from_date || '');
              const incentivesVal = rowData.incentives !== undefined ? rowData.incentives : (item.incentives || '');
              const leaveDedVal = rowData.leaveDeductions !== undefined ? rowData.leaveDeductions : (item.leave_deductions || '');
              const pfDedVal = rowData.pfDeductions !== undefined ? rowData.pfDeductions : (item.pf_deductions || '');
              const payDateVal = rowData.payDate !== undefined ? rowData.payDate : (item.pay_date || '');

              // If the user typed something new into this specific row, treat it as a new Generation request
              const isModified = Object.keys(rowData).length > 0;
              const mode = (!item.payslip_generated || isModified) ? 'generate' : 'download';

              return (
                <tr key={index}>
                  <td>{item.employee_id}</td>
                  <td>{item.employee_name}</td>
                  <td>{item.role}</td>
                  <td>{item.department}</td>
                  <td>₹{item.net_salary}</td>

                  {/* Editable: Pay From Date */}
                  <td>
                    <input
                      type="date"
                      value={payFromDateVal}
                      onChange={(e) => handleInputChange(item.payroll_id, 'payFromDate', e.target.value)}
                      style={{ padding: '5px' }}
                    />
                  </td>

                  {/* Editable: Incentives */}
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={incentivesVal}
                      onChange={(e) => handleInputChange(item.payroll_id, 'incentives', e.target.value)}
                      style={{ padding: '5px', width: '80px' }}
                    />
                  </td>

                  {/* Editable: Leave Deductions */}
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={leaveDedVal}
                      onChange={(e) => handleInputChange(item.payroll_id, 'leaveDeductions', e.target.value)}
                      style={{ padding: '5px', width: '80px' }}
                    />
                  </td>

                  {/* Editable: PF Deductions */}
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={pfDedVal}
                      onChange={(e) => handleInputChange(item.payroll_id, 'pfDeductions', e.target.value)}
                      style={{ padding: '5px', width: '80px' }}
                    />
                  </td>

                  {/* Editable: Pay Date */}
                  <td>
                    <input
                      type="date"
                      value={payDateVal}
                      onChange={(e) => handleInputChange(item.payroll_id, 'payDate', e.target.value)}
                      style={{ padding: '5px' }}
                    />
                  </td>

                  <td>
                    <button
                      onClick={() => handlePayslipAction(item.payroll_id, mode)}
                      style={{
                        backgroundColor: mode === 'generate' ? '#4CAF50' : '#2196F3',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {mode === 'generate' ? "Generate Payslip" : "Download"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;