import os
import sqlite3

def create_database():
    script_dir = os.path.dirname(__file__)
    db_path = os.path.join(script_dir, 'database.db')
    
    # Connect to SQLite database (it will be created if it doesn't exist)
    connection = sqlite3.connect(db_path)
    
    try:
        with connection:
            with open(os.path.join(script_dir, 'db schema.txt'), 'r') as f:
                sql = f.read()
            # Remove CREATE DATABASE and USE statements
            sql = '\n'.join(
                line for line in sql.splitlines()
                if not line.strip().startswith(('CREATE DATABASE', 'USE', 'DROP DATABASE'))
            )
            # Execute each statement
            for statement in sql.split(';'):
                stmt = statement.strip()
                if stmt:
                    connection.execute(stmt)
    finally:
        connection.close()

if __name__ == '__main__':
    create_database()