from flask import Blueprint, jsonify, request
from models import Parent

parent_name_bp = Blueprint("parentname", __name__)

@parent_name_bp.route('/parentname', methods=['GET'])
def get_parent_name():
    try:
        parent_id = request.args.get('parent_id', type=int)
        if not parent_id:
            return jsonify({"error": "Parent ID is required"}), 400

        parent = Parent.query.get_or_404(parent_id)
        return jsonify({"parent_name": parent.name, "children": []}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
