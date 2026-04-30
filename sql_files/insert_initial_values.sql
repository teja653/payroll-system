-- Populate Employee table
INSERT INTO Employee (first_name, last_name, email, phone_number, address, department, role, status, salary, hire_date)
VALUES 
    ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Human Resources', 'Manager', 'active', 55000.00, '2024-06-15');
    
INSERT INTO Users (username, password, employee_id, role)
VALUES 
    ('john_doe', 'hashed_password1', 1, 'admin');
   

-- Populate Payroll table
INSERT INTO Payroll (employee_id, basic_salary, incentives, pf_deductions, tax_deduction, leave_deductions, net_salary, pay_date, payslip_generated)
VALUES 
    (1, 55000.00, 5000.00, 2750.00, 2000.00, 55500.00, '2024-10-01', FALSE);
    


-- Populate Leaves table
INSERT INTO Leaves (employee_id, leave_type, start_date, end_date, status, reason)
VALUES 
    (1, 'Annual Leave', '2024-12-01', '2024-12-05', 'Pending', 'Family vacation');
    

SELECT * FROM Users;
SELECT * FROM Employee;
SELECT * FROM Payroll;
SHOW TRIGGERS LIKE 'Payroll';
SHOW TRIGGERS LIKE 'Employee';

-- To check tax_bracket_id trigger
INSERT INTO Employee (first_name, last_name, email, phone_number, address, department, role, status, salary, hire_date)
VALUES ('Zara', 'Allen', 'zara.allen@example.com', '1234567890', '123 Main St', 'Finance', 'Analyst', 'Active', 45000, '2023-01-01');

SELECT employee_id, first_name, salary, tax_bracket_id
FROM Employee
WHERE email = 'zara.allen@example.com';


-- To check deduction and net_salary calculation triggers
INSERT INTO Payroll (employee_id, basic_salary, bonus, deductions, pay_date)
VALUES (11, 45000, 5000, 2000, '2023-01-31');

SELECT payroll_id, employee_id, basic_salary, bonus, deductions, tax_deduction, net_salary
FROM Payroll
WHERE employee_id = 11;

SELECT * FROM Payslips;
SELECT * FROM Leaves;

UPDATE Users
SET role = 'employee'
WHERE username IN ('emily_d', 'sophia_l', 'daniel_h');

truncate table leaves;
SET FOREIGN_KEY_CHECKS = 0;
truncate table payroll;
SET FOREIGN_KEY_CHECKS = 1;

truncate TABLE users;
SET FOREIGN_KEY_CHECKS = 0;
truncate table employee;
SET FOREIGN_KEY_CHECKS = 1;