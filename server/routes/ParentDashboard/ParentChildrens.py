from flask import Blueprint, jsonify, request
from models import Parent

parent_children_bp = Blueprint("parent_children", __name__)

@parent_children_bp.route('/parent/children', methods=['GET'])
def get_parent_children():
    parent_id = request.args.get('parent_id', type=int)
    
    if not parent_id:
        return jsonify({"error": "Parent ID is required"}), 400

    try:
        parent = Parent.query.get_or_404(parent_id)
        
        children = [
            {"id": parent.student.student_id, "name": parent.student.name}
        ]

        return jsonify({"parent_name": parent.name, "children": children}), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
