-- Table: Tax_Bracket
CREATE TABLE Tax_Bracket (
    tax_bracket_id INT AUTO_INCREMENT PRIMARY KEY,
    min_salary DECIMAL(15, 2) NOT NULL,
    max_salary DECIMAL(15, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL,
    UNIQUE (min_salary, max_salary)
);

ALTER TABLE Tax_Bracket MODIFY max_salary DECIMAL(15, 2) NULL;

INSERT INTO Tax_Bracket (min_salary, max_salary, tax_rate) VALUES 
    (0.00, 30000.00, 5.00),      -- 5% tax for salaries up to 30,000
    (30001.00, 60000.00, 10.00), -- 10% tax for salaries between 30,001 and 60,000
    (60001.00, 100000.00, 15.00),-- 15% tax for salaries between 60,001 and 100,000
    (100001.00, NULL, 20.00);    -- 20% tax for salaries above 100,000

-- Table: Employee
CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    address TEXT,
    department VARCHAR(50),
    role VARCHAR(50),
    status VARCHAR(20),
    salary DECIMAL(15, 2) NOT NULL,
    hire_date DATE NOT NULL,
    tax_bracket_id INT,
    FOREIGN KEY (tax_bracket_id) REFERENCES Tax_Bracket(tax_bracket_id) ON DELETE SET NULL
);

DELIMITER //

CREATE TRIGGER set_tax_bracket_before_insert
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
    DECLARE bracket_id INT;

    -- Find the appropriate tax bracket based on the salary
    SELECT tax_bracket_id INTO bracket_id
    FROM Tax_Bracket
    WHERE NEW.salary BETWEEN min_salary AND IFNULL(max_salary, NEW.salary)
    LIMIT 1;

    -- Set the tax_bracket_id for the new employee record
    SET NEW.tax_bracket_id = bracket_id;
END //

DELIMITER ;


-- Table: Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    employee_id INT,
    role VARCHAR(20) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE
);


-- Table: Payroll
CREATE TABLE Payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    basic_salary DECIMAL(15, 2) NOT NULL,
    incentives DECIMAL(15, 2) DEFAULT 0,
    tax_deduction DECIMAL(15, 2),
    leave_deductions DECIMAL(15, 2) DEFAULT 0,
    pf_deductions DECIMAL(15, 2) DEFAULT 0,
    net_salary DECIMAL(15, 2),
    pay_date DATE NOT NULL,
    payslip_generated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER calculate_tax_deduction
BEFORE INSERT ON Payroll
FOR EACH ROW
BEGIN
    DECLARE tax_rate DECIMAL(5, 2);

    -- Retrieve the tax rate for the employee’s tax bracket
    SELECT tb.tax_rate INTO tax_rate
    FROM Tax_Bracket tb
    JOIN Employee e ON e.tax_bracket_id = tb.tax_bracket_id
    WHERE e.employee_id = NEW.employee_id;

    -- Calculate tax deduction with default values in case of NULL fields
    SET NEW.tax_deduction = IFNULL(NEW.basic_salary, 0) * (tax_rate / 100);
    -- Calculate net_salary, ensuring all values are non-NULL
    SET NEW.net_salary = IFNULL(NEW.basic_salary, 0) + IFNULL(NEW.incentives, 0) - IFNULL(NEW.leave_deductions, 0) - IFNULL(NEW.pf_deductions, 0) - IFNULL(NEW.tax_deduction, 0);
END //

DELIMITER ;


-- Table: Payslips
CREATE TABLE Payslips (
    payslip_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    payroll_id INT NOT NULL,
    payslip_pdf BLOB,
    generated_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_id) REFERENCES Payroll(payroll_id) ON DELETE CASCADE
);

-- Table: Leaves
CREATE TABLE Leaves (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_leave_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date) + 1) STORED,
    reason TEXT,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE
);

show tables;
-- drop table Tax_Bracket, Employee, Users, Payroll, Payslips, Leaves;
select * from employee;
select * from leaves;
select * from users
