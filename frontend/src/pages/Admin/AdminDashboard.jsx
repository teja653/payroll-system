// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import styles from '../../styles/Admin/AdminDashboard.module.css';
import Sidebar from './AdminSidebar';
import totalEmployeesIcon from '../../assets/totalEmployees.png';
import pendingLeavesIcon from '../../assets/pendingLeaves.png';
import salaryIcon from '../../assets/salary.png';
import bonusIcon from '../../assets/bonus.png';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Filler, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalEmployees: 0,
    avgSalary: 0,
    payrollExpenses: [],
    xAxisLabels: [],
    departmentData: {},
    turnoverRate: 0,
    employeeGrowth: [],
    departmentPayrollData: {},
    highestSalaryEmployees: [],
    bonusesIncentivesPaid: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const payrollData = {
    labels: data.xAxisLabels,  // Auto-populated x-axis labels
    datasets: [
      {
        label: 'Payroll Expenses',
        data: data.payrollExpenses,
        backgroundColor: 'rgba(85, 168, 203, 0.2)', // Light fill for area chart
        borderColor: '#55A8CB',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const departmentPayrollData = {
    labels: Object.keys(data.departmentPayrollData),
    datasets: [
      {
        label: 'Payroll by Department',
        data: Object.values(data.departmentPayrollData),
        backgroundColor: ['#55A8CB', '#FF6392', '#FFE45E', '#741C79', '#FF5647', '#8DE969'],
      },
    ],
  };

  const employeeGrowthData = {
    labels: data.employeeGrowth.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'New Hires per Month',
        data: data.employeeGrowth.map(item => item.count),
        backgroundColor: 'rgba(116, 28, 121, 0.2)',
        borderColor: '#741C79',
        fill: true,
        tension: 0.4,
      },
    ],
  };


  const deptPayrollChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true, // Shows color swatches as points
          boxWidth: 10, // Width of the color swatch boxes
          padding: 15, // Spacing between legend items
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
  };


  const chartOptions = (startColor, endColor) => ({
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
    elements: {
      line: {
        borderColor: startColor,
        backgroundColor: 'rgba(85, 168, 203, 0.2)',
      },
      point: {
        radius: 5,
        hoverRadius: 8,
        hoverBackgroundColor: '#FF6392',
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuad',
    },
  });

  return (
    <div className={styles.adminDashboard}>
      <Sidebar />

      <main className={styles.dashboardContent}>
        <h1>Admin Dashboard</h1>

        <div className={styles.gridLayout}>
          {/* Top Row Cards */}
          <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
              <div className={styles.cardContent}>
                <img src={totalEmployeesIcon} alt="Total Employees Icon" className={styles.metricIcon} />
                <div>
                  <div className={styles.metricNumber}>{data.totalEmployees}</div>
                  <div className={styles.metricLabel}>Total Employees</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
              <div className={styles.cardContent}>
                <img src={pendingLeavesIcon} alt="Pending Leaves Icon" className={styles.metricIcon} />
                <div>
                  <div className={styles.metricNumber}>{data.pendingLeaves}</div>
                  <div className={styles.metricLabel}>Pending Leave Requests</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
              <div className={styles.cardContent}>
                <img src={salaryIcon} alt="Average Base Salary Icon" className={styles.metricIcon} />
                <div>
                  <div className={styles.metricNumber}>{data.avgSalary}</div>
                  <div className={styles.metricLabel}>Average Base Salary</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
              <div className={styles.cardContent}>
                <img src={bonusIcon} alt="Bonus Icon" className={styles.metricIcon} />
                <div>
                  <div className={styles.metricNumber}>{data.bonusesIncentivesPaid}</div>
                  <div className={styles.metricLabel}>Bonuses & Incentives Paid in the Past Year</div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Payroll Chart */}
          <div className={styles.deptPayrollChart}>
            <h3>Payroll Expenses per Department</h3>
            <div className={styles.doughnutWrapper}>
              <Doughnut data={departmentPayrollData} options={deptPayrollChartOptions} />
            </div>
          </div>

          {/* Payroll Expenses Chart */}
          <div className={styles.payrollChart}>
            <h3>Payroll Expenses</h3>
            <Line data={payrollData} options={chartOptions('#55A8CB', '#741C79')} />
          </div>

          {/* Employee Growth Chart */}
          <div className={styles.employeeGrowthChart}>
            <h3>Employee Growth (Monthly)</h3>
            <Line data={employeeGrowthData} options={chartOptions('#741C79', '#FF6392')} />
          </div>

          {/* Highest Salary Employees */}
          <div className={styles.highestSalarySection}>
            <h3>Top 5 Highest Base Salary of Employees</h3>
            <ul>
              {data.highestSalaryEmployees.map((emp, index) => (
                <li key={index}>{emp.name}: ₹{emp.salary}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
