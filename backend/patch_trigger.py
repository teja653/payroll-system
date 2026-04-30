from app import app, db
from sqlalchemy import text

trigger_sql = """
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
END
"""

with app.app_context():
    try:
        # Drop existing trigger
        db.session.execute(text("DROP TRIGGER IF EXISTS calculate_tax_deduction"))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error dropping trigger: {e}")

    try:
        # Create new trigger
        db.session.execute(text(trigger_sql))
        db.session.commit()
        print("Successfully updated the calculate_tax_deduction trigger!")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating trigger: {e}")
