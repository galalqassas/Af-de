from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class SingletonDB:
    db = None

    @staticmethod
    def init_db(app):
        if not all(key in app.config for key in ['SQLALCHEMY_DATABASE_URI']):
            raise ValueError("Database configuration value is missing in app.config")
    
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
        app.config['SQLALCHEMY_ECHO'] = False  
    
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        SingletonDB.db = sessionmaker(bind=engine)
    
    @property
    def get_db(cls):

        return cls.db