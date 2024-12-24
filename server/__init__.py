import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_swagger_ui import get_swaggerui_blueprint
from utils.db import singleton_db  # Import the singleton_db instance
from config import Config

from routes.LandingPage.LandingPageCourses import landing_course_bp
from routes.LandingPage.Teachers import teacher_bp
from routes.LandingPage.Feedback import feedback_bp
from routes.LandingPage.Courses import course_bp
from routes.LandingPage.CoursePage import course_page_bp
from routes.auth import auth
from server.routes.TeacherDashboard.row1 import dashboard_bp
from routes.TeacherDashboard.badge import badge_bp
from routes.AdminDashboard.admin_dashboard import dash_home_bp
from routes.AdminDashboard.course_list import course_list_bp
from routes.AdminDashboard.teacher_approval import teacher_approval_bp
from routes.StudentDashboard.StudentDashboardCourses import student_dashboard_course_bp
from routes.StudentDashboard.DisplayStudentName import student_name_bp
from routes.StudentDashboard.AnnouncementsAndTeachers import announcements_and_teachers_bp
from routes.StudentDashboard.PerformanceChart import performance_bp
from routes.StudentDashboard.Timetable import timetable_bp
from routes.ParentDashboard.DisplayParentName import parent_name_bp
from routes.ParentDashboard.ParentChildrens import parent_children_bp
from routes.ParentDashboard.StudentProgress import student_progress_bp
from routes.GoogleOAuth import google_oauth_bp
from routes.TeacherDashboard.AddSession import session_bp
from routes.payment import payment_bp
from flask_session import Session
from routes.StudentDashboard.ShowEnrolledCourses import student_enrolled_courses_bp
from routes.StudentDashboard.FeedbackForm import feedback_form_bp
from routes.StudentDashboard.Quiz import quiz_bp
from routes.TeacherDashboard.QuizCreation import quiz_creation_bp
from routes.TeacherDashboard.ValidateQuestion import validate_quiz_creation_bp

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    # Enable CORS
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173"],  # Modify if needed
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    )

    # Initialize other extensions
    Mail(app)
    Session(app)

    # Initialize SingletonDB and connect to the app
    singleton_db.init_db(app)

    # Swagger UI setup
    SWAGGER_URL = '/api/docs'
    API_URL = '/static/SCHOLAR.postman_collection.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': "Scholar Project"}
    )

    # Register all blueprints
    app.register_blueprint(landing_course_bp)
    app.register_blueprint(course_bp)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(badge_bp)
    app.register_blueprint(swaggerui_blueprint)
    app.register_blueprint(dash_home_bp, url_prefix='/api')
    app.register_blueprint(course_list_bp, url_prefix='')
    app.register_blueprint(teacher_approval_bp)
    app.register_blueprint(course_page_bp)
    app.register_blueprint(student_dashboard_course_bp)
    app.register_blueprint(student_name_bp)
    app.register_blueprint(announcements_and_teachers_bp)
    app.register_blueprint(performance_bp)
    app.register_blueprint(timetable_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(parent_name_bp)
    app.register_blueprint(parent_children_bp)
    app.register_blueprint(student_progress_bp)
    app.register_blueprint(google_oauth_bp, url_prefix='/auth')
    app.register_blueprint(session_bp)
    app.register_blueprint(student_enrolled_courses_bp)
    app.register_blueprint(feedback_form_bp, name="unique_feedback")
    app.register_blueprint(quiz_bp, url_prefix="/quiz")
    app.register_blueprint(quiz_creation_bp)
    app.register_blueprint(validate_quiz_creation_bp)

    @app.route('/')
    def main_page():
        return "<h1>This is the main page of the server</h1>"

    return app
