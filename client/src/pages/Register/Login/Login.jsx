import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);

        if (result.role === "student") {
          sessionStorage.setItem("student_id", result.student_id);
          navigate("/student-dashboard");
        } else if (result.role === "teacher") {
          sessionStorage.setItem("teacher_id", result.teacher_id);
          navigate("/teacher-dashboard");
        } else if (result.role === "parent") {
          sessionStorage.setItem("parent_id", result.parent_id);
          navigate("/parent-dashboard");
        }else if (result.role === "admin") {
          sessionStorage.setItem("admin_id", result.admin_id);
          navigate("/admin-dashboard"); 
        }else {
          setError("Unknown role received.");
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    if (!role) {
      setError("Please select a role before signing in with Google.");
      return;
    }

    const queryParams = new URLSearchParams({ role });
    window.location.href = `http://localhost:5000/auth/google-login?${queryParams.toString()}`;
  };

  useEffect(() => {
    if (location.pathname === "/auth/google/callback") {
      const role = new URLSearchParams(window.location.search).get("role");

      if (!role) {
        setError("No role found in URL.");
        return;
      }

      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "parent") {
        navigate("/parent-dashboard");
      } else if(role == "admin"){
          navigate("/admin-dashboard");
        }
     else {
        setError("Unknown role.");
      }
    }
  }, [location, navigate]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.left}>
          <h1 className={styles.title}>Scholar</h1>
          <div className={styles.socialLogin}>
            {error && <p className={styles.error}>{error}</p>}
            <select
              className={styles.roleDropdown}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
            <button className={styles.google} onClick={handleGoogleLogin}>
              Sign in with Google
            </button>
          </div>
          <p className={styles.or}>or use your email and password</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {success && <p className={styles.success}>{success}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p
              className={styles.forgot}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Your Password?
            </p>
            <button type="submit" className={styles.btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h3>Hello!</h3>
          <p>
            Register with your personal details to use all of our site features.
          </p>
          <button className={styles.btn} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
