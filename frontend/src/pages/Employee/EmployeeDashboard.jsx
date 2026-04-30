import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import styles from '../../styles/Employee/EmployeeDashboard.module.css';
import Sidebar from './EmployeeSidebar';

const EmployeeDashboard = ({ employeeId }) => {
  const [data, setData] = useState({
    name: "",
    role: "",
    department: "",
    basicSalary: 0,
    netSalary: 0,
    incentives: 0,
    taxDeduction: 0,
    leaveDeductions: 0,
    pfDeductions: 0,
    isPayslipGenerated: false,
    payslipUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [filteredPayslips, setFilteredPayslips] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchPayrollData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
          withCredentials: true,
        });

        if (response.data && response.data.length > 0) {
          const sortedData = response.data.sort((a, b) => new Date(b.pay_date) - new Date(a.pay_date));
          const latestPayroll = sortedData[0];
          setData({
            name: latestPayroll.employee_name,  // Add name
            role: latestPayroll.role,           // Add role
            department: latestPayroll.department, // Add department
            basicSalary: latestPayroll.basic_salary || 0,
            netSalary: latestPayroll.net_salary || 0,
            incentives: latestPayroll.incentives || 0,
            taxDeduction: latestPayroll.tax_deduction || 0,
            leaveDeductions: latestPayroll.leave_deductions || 0,
            pfDeductions: latestPayroll.pf_deductions || 0,
            isPayslipGenerated: latestPayroll.payslip_generated || false,
            payslipUrl: latestPayroll.payslip_pdf || null,
          });

          setPayslips(sortedData);
          setFilteredPayslips(sortedData);
        }
      } catch (error) {
        setError('Error fetching payroll data');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [employeeId]);

  useEffect(() => {
    let result = payslips;
    if (selectedYear) {
      result = result.filter(p => new Date(p.pay_date).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth) {
      result = result.filter(p => (new Date(p.pay_date).getMonth() + 1).toString() === selectedMonth);
    }
    setFilteredPayslips(result);
  }, [selectedMonth, selectedYear, payslips]);

  const handlePayslipDownload = async (payslipUrl, id) => {
    if (payslipUrl) {
      try {
        const response = await axios.get(`http://localhost:5000${payslipUrl}`, {
          responseType: 'blob',
        });

        // Create a URL for the blob object and download the file
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Payslip_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading payslip:", error);
        alert("Failed to download payslip");
      }
    } else {
      alert("Payslip not generated yet.");
    }
  };

  const dataPie = {
    labels: ['Basic Salary', 'Incentives', 'Tax Deduction', 'Leave Deductions', 'PF Deductions'],
    datasets: [
      {
        data: [data.basicSalary, data.incentives, data.taxDeduction, data.leaveDeductions, data.pfDeductions],
        backgroundColor: ['#55A8CB', '#FF6392', '#FFE45E', '#741C79', '#FF5647'],
        hoverBackgroundColor: ['#6AC9F2', '#FF7BA3', '#FFEA82', '#CB3CD2', '#FC8479'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) return (
    <div className={styles.employeeDashboard}>
      <Sidebar />
      <main className={styles.dashboardContent}>
        <div className={styles.loadingSpinner}>Loading dashboard data...</div>
      </main>
    </div>
  );
  if (error) return <div>{error}</div>;


  return (
    <div className={styles.employeeDashboard}>
      <Sidebar />
      <main className={styles.dashboardContent}>
        <div className={styles.welcomeWrapper}>
          <h3>Welcome {data.name},</h3>
          <h3>You work at the {data.department} Department as a {data.role}</h3>
        </div>
        <div className={styles.gridLayout}>
          {/* Salary Cards */}
          {[
            { label: "Basic Salary", value: data.basicSalary },
            { label: "Net Salary", value: data.netSalary },
            { label: "Incentives", value: data.incentives },
            { label: "Tax Deduction", value: data.taxDeduction },
            { label: "Leave Deductions", value: data.leaveDeductions },
            { label: "PF Deductions", value: data.pfDeductions }
          ].map((item, index) => (
            <div key={index} className={styles.metricsContainer}>
              <div className={styles.metricCard}>
                <div className={styles.cardContent}>
                  <div>
                    <div className={styles.metricLabel}>{item.label}</div>
                    <div className={styles.metricNumber}>
                      ₹{item.value ? item.value.toLocaleString() : '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View Payslips Section */}
          <div className={styles.payslipHistorySection}>
            <div className={styles.historyHeader}>
              <h3>Payslip History</h3>
              <div className={styles.filters}>
                <select
                  className={styles.filterSelect}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>

                <select
                  className={styles.filterSelect}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
            </div>

            <div className={styles.payslipTableWrapper}>
              {filteredPayslips.length > 0 ? (
                <table className={styles.payslipTable}>
                  <thead>
                    <tr>
                      <th>Month & Year</th>
                      <th>Basic Salary</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayslips.map((payslip, index) => {
                      const payDate = new Date(payslip.pay_date);
                      const monthYear = payDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                      return (
                        <tr key={index}>
                          <td>{monthYear}</td>
                          <td>₹{Number(payslip.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>₹{Number(payslip.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{payslip.payslip_generated ? 'Generated' : 'Pending'}</td>
                          <td>
                            {payslip.payslip_generated && payslip.payslip_pdf ? (
                              <button
                                className={styles.downloadButton}
                                onClick={() => handlePayslipDownload(payslip.payslip_pdf, employeeId || 'Employee')}
                              >
                                Download
                              </button>
                            ) : (
                              <button className={styles.disabledButton} disabled>
                                Not Available
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noData}>No Payslips Available</div>
              )}
            </div>
          </div>
          <div className={styles.Chart}>
            <h3>Payroll</h3>
            <div className={styles.pieWrapper}>
              <Pie data={dataPie} options={options} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default EmployeeDashboard;
