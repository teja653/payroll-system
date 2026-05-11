# Payroll Management System

A robust, full-stack application designed to streamline employee management, payroll processing, leave tracking, and automated payslip generation. It features role-based access control with distinct functionalities for Administrators and Employees.

## Table of Contents
1. [End-to-End System Workflow](#end-to-end-system-workflow)
2. [Technology Stack](#technology-stack)
3. [Requirements & Prerequisites](#requirements--prerequisites)
4. [Folder Structure & File Purposes](#folder-structure--file-purposes)
5. [Setup Instructions](#setup-instructions)

---

## End-to-End System Workflow

### 1. Database Layer (MySQL)
The system relies on a relational database architecture. 
- **Core Entities**: The DB stores records for `Users`, `Employee`, `Payroll`, `Leaves`, `Payslips`, and `Tax_Bracket`.
- **Stored Procedures**: Complex aggregations (e.g., getting total employees, calculating average salaries, building department-wise payroll expense charts, and tracking monthly employee growth) are offloaded to MySQL stored procedures. This improves the performance of the Admin Dashboard.
- **Cascading & Triggers**: Handled effectively at the DB level, so when an employee is deleted, all their corresponding payrolls, leaves, and user access records are automatically cleaned up.

### 2. Backend Layer (Python / Flask)
The backend acts as the central engine managing business logic and connecting the frontend to the database.
- **RESTful API**: Exposes standard endpoints for CRUD operations on employees, leaves, and payroll records.
- **Authentication**: Provides session-based login distinguishing between `admin` and `employee` roles, securely directing users to their respective dashboards.
- **Payroll & Tax Calculation**: Automatically calculates the net salary based on basic salary, incentives, leave deductions, PF (Provident Fund) deductions, and dynamically determined tax brackets.
- **Automated PDF Generation**: Utilizes `reportlab` to dynamically draw and generate PDF payslips based on an employee's specific payroll cycle. Generated PDFs are directly stored as binary blobs in the database and served to the user for download.

### 3. Frontend Layer (React + Vite)
The user interface is a responsive Single Page Application (SPA).
- **Admin Portal**: Displays a high-level analytics dashboard utilizing `Chart.js` to render visual representations of payroll expenses and employee growth. Allows admins to manage the employee lifecycle, process monthly payrolls, and approve or reject leave applications.
- **Employee Portal**: Provides a dedicated space for employees to view their personal profile, track their payroll history, download their monthly PDF payslips directly, and submit leave requests.

---

## Technology Stack

- **Frontend**: React (v18), Vite, React Router DOM, Chart.js, Axios, Tailwind CSS / Custom CSS.
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-CORS, ReportLab (for PDFs).
- **Database**: MySQL 8.0+, PyMySQL.

---

## Requirements & Prerequisites

Ensure your development environment meets the following requirements before setup:

### System Prerequisites
- **Node.js**: v18.x or higher
- **Python**: 3.8 or higher
- **MySQL Server**: 8.0 or higher

### Python Dependencies (Backend)
Located in `requirements.txt`:
- `Flask`
- `Flask-SQLAlchemy`
- `Flask-Cors`
- `SQLAlchemy`
- `PyMySQL`
- `reportlab` (for PDF generation)
- `python-dateutil`

### Node Dependencies (Frontend)
Located in `package.json`:
- `react`, `react-dom`
- `vite`, `@vitejs/plugin-react`
- `axios` (for HTTP requests)
- `react-router-dom` (for routing)
- `chart.js`, `react-chartjs-2`, `chartjs-plugin-datalabels` (for dashboard analytics)
- `lucide-react` (for icons)

---

## Folder Structure & File Purposes

```text
Payroll-Management-System/
│
├── backend/                       # Python Flask Backend
│   ├── app.py                     # Main application entry point. Contains all API routes, SQLAlchemy models, and core business logic (PDF generation, computations).
│   ├── config.py                  # Environment and database configuration constants.
│   └── requirements.txt           # Python package dependencies.
│
├── frontend/                      # React Frontend App
│   ├── index.html                 # Main HTML template injected by Vite.
│   ├── package.json               # Node dependencies and project scripts.
│   ├── vite.config.js             # Vite bundler configuration file.
│   └── src/
│       ├── main.jsx               # React DOM entry point.
│       ├── index.css              # Global styles.
│       ├── pages/                 
│       │   ├── Admin/             # Admin specific pages/components
│       │   │   ├── AdminDashboard.jsx  # Analytics and statistics overview.
│       │   │   ├── AdminSidebar.jsx    # Sidebar navigation for the Admin layout.
│       │   │   ├── AddEmployeeForm.jsx # Form component for creating/updating employees.
│       │   │   ├── EmployeeList.jsx    # Table listing all employees with management actions.
│       │   │   ├── LeavesList.jsx      # Interface to review and approve/reject employee leaves.
│       │   │   ├── LoginPage.jsx       # Universal login page handling authentication.
│       │   │   └── PayrollList.jsx     # Interface for processing payrolls and generating payslips.
│       │   │
│       │   └── Employee/          # Employee specific pages/components
│       │       ├── EmployeeDashboard.jsx # Shows employee's personal payroll history and payslips.
│       │       ├── EmployeeProfile.jsx   # Displays the logged-in employee's details.
│       │       ├── EmployeeSidebar.jsx   # Sidebar navigation for the Employee layout.
│       │       └── LeaveApplication.jsx  # Form for submitting new leave requests.
│
├── sql_files/                     # Database Initialization Scripts
│   ├── table_creation.sql         # DDL script defining tables, foreign keys, and constraints.
│   ├── insert_initial_values.sql  # DML script providing seed data (tax brackets, initial admin user).
│   └── admin_procedures.sql       # SQL script containing Stored Procedures used for dashboard analytics.
│
└── README.md                      # Project documentation (this file).
```

---

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client/workbench.
2. Create a new database named `payroll_management`.
3. Execute the SQL scripts in the `sql_files` directory in the following order:
   - `table_creation.sql`
   - `insert_initial_values.sql`
   - `admin_procedures.sql`

### 2. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure database connection in `app.py` (update the MySQL credentials if needed).
6. Run the Flask server: `python app.py` (Server will run on `http://localhost:5000`)

### 3. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install Node modules: `npm install`
3. Start the development server: `npm run dev`
4. Access the application in your browser at `http://localhost:5173` (or the port specified by Vite).
