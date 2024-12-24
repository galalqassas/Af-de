from flask import Blueprint, jsonify, request
from models import Student
from models.decorators import log_data_access  

student_name_bp = Blueprint("studentname", __name__)

@student_name_bp.route('/studentname', methods=['GET'])
@log_data_access  
def get_student_name():
    student_id = request.args.get('student_id', type=int)
    if not student_id:
        return jsonify({"error": "Student ID is required"}), 400

    try:
        student = Student.query.get_or_404(student_id)

        return jsonify({"student_name": student.name}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
