from functools import wraps
import logging

logging.basicConfig(level=logging.INFO)

def log_data_access(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        
        if hasattr(result, 'student_id'):
            logging.info(f"Student data retrieved: ID = {result.student_id}, Name = {result.name}")
        elif hasattr(result, 'student_id') and hasattr(result, 'amount'):
            logging.info(f"Payment created for Student ID: {result.student_id}, Amount: {result.amount}")
        else:
            logging.info(f"Data retrieved: {result}")

        return result
    return wrapper
