import sys
from app import app, db, Employee

with app.app_context():
    employee_id = 1
    try:
        employee = Employee.query.get(employee_id)
        if employee:
            from sqlalchemy import text
            db.session.execute(text("DELETE FROM Employee WHERE employee_id = :eid"), {"eid": employee_id})
            db.session.commit()
            print("Delete successful")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting employee: {e}")
