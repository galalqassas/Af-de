from flask_sqlalchemy import SQLAlchemy

class SingletonDB:
    _instance = None
    db = SQLAlchemy()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SingletonDB, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def init_db(self, app):
        if not all(key in app.config for key in ['MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_HOST', 'MYSQL_DB']):
            raise ValueError("Database configuration values are missing in app.config")

        app.config['SQLALCHEMY_DATABASE_URI'] = (
            f"mysql+pymysql://{app.config['MYSQL_USER']}:{app.config['MYSQL_PASSWORD']}@"
            f"{app.config['MYSQL_HOST']}/{app.config['MYSQL_DB']}"
        )
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
        app.config['SQLALCHEMY_ECHO'] = False  

        SingletonDB.db.init_app(app)  

    @property
    def get_db(cls):
        """
        Returns the singleton db instance.
        """
        return cls.db

singleton_db = SingletonDB()
