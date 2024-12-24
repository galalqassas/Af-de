import React, { useEffect, useState } from "react";
import "./ParentHeader.css";

const ParentHeader = ({ onChildSelect }) => {
    const [parentName, setParentName] = useState("");
    const [children, setChildren] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const parentId = sessionStorage.getItem("parent_id");

        if (!parentId) {
            setError("Parent ID is missing. Please log in again.");
            return;
        }

        fetch(`http://127.0.0.1:5000/parent/children?parent_id=${parentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch parent data");
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setParentName(data.parent_name);
                    setChildren(data.children || []);
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    return (
        <header className="parent-header">
            <div className="greeting">
                <h1>Welcome, {parentName}!</h1>
                <p>Select a child to view their progress.</p>
            </div>
            <div
                className={`children-list ${
                    children.length === 1 ? "single-child" : "multiple-children"
                }`}
            >
                {children.length > 0 ? (
                    children.map((child) => (
                        <div
                            key={child.id}
                            className="child-item"
                            onClick={() => onChildSelect(child.id)}
                        >
                            <div className="child-icon">
                                <i className="fa fa-user-circle" aria-hidden="true"></i>
                            </div>
                            <div className="child-name">{child.name}</div>
                        </div>
                    ))
                ) : (
                    <p className="no-children-message">No children found for this parent.</p>
                )}
            </div>
        </header>
    );
};

export default ParentHeader;
