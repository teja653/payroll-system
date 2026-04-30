DELIMITER //

CREATE PROCEDURE GetTotalEmployees()
BEGIN
    SELECT COUNT(employee_id) AS total FROM Employee;
END //

DELIMITER ;

-- -----------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetAverageSalary()
BEGIN
    SELECT IFNULL(AVG(salary), 0.00) AS avg_salary FROM Employee;
END //

DELIMITER ;

-- ------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetEmployeeCountPerDepartment()
BEGIN
    SELECT department, COUNT(employee_id) AS count 
    FROM Employee 
    GROUP BY department;
END //

DELIMITER ;
-- ---------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetPayrollExpensesLast12Months()
BEGIN
    SELECT 
        EXTRACT(YEAR FROM pay_date) AS year, 
        EXTRACT(MONTH FROM pay_date) AS month,
        SUM(net_salary) AS total
    FROM Payroll
    WHERE pay_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
END //

DELIMITER ;
-- -------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetPendingLeavesCount()
BEGIN
    SELECT COUNT(leave_id) AS pending_count FROM Leaves WHERE status = 'pending';
END //

DELIMITER ;

-- ----------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetEmployeeGrowth()
BEGIN
    SELECT 
        EXTRACT(YEAR FROM hire_date) AS year, 
        EXTRACT(MONTH FROM hire_date) AS month,
        COUNT(employee_id) AS count
    FROM Employee
    WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
END //

DELIMITER ;
-- ------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetDepartmentPayrollExpenses()
BEGIN
    SELECT 
        e.department, 
        SUM(p.net_salary) AS total
    FROM Employee e
    JOIN Payroll p ON e.employee_id = p.employee_id
    GROUP BY e.department;
END //

DELIMITER ;
-- --------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetTop5HighestSalaryEmployees()
BEGIN
    SELECT first_name, last_name, salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 5;
END //

DELIMITER ;
-- ----------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE GetTotalBonusesIncentives()
BEGIN
    SELECT IFNULL(SUM(bonus), 0.00) AS bonuses_total
    FROM Payroll
    WHERE pay_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH);
END //

DELIMITER ;



-- DROP PROCEDURE IF EXISTS GetTotalEmployees;
-- DROP PROCEDURE IF EXISTS GetAverageSalary;
-- DROP PROCEDURE IF EXISTS GetEmployeeCountPerDepartment;
-- DROP PROCEDURE IF EXISTS GetPayrollExpensesLast12Months;
-- DROP PROCEDURE IF EXISTS GetPendingLeavesCount;
-- DROP PROCEDURE IF EXISTS GetEmployeeGrowth;
-- DROP PROCEDURE IF EXISTS GetDepartmentPayrollExpenses;
-- DROP PROCEDURE IF EXISTS GetTop5HighestSalaryEmployees;
-- DROP PROCEDURE IF EXISTS GetTotalBonusesIncentives;


