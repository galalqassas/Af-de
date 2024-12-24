import { useNavigate, useLocation } from "react-router-dom";
import './LandingPageHeader.css';
import '@fortawesome/fontawesome-free/css/all.css';

function LandingPageHeader() {
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleScroll = (id) => {
        if (location.pathname === "/") {
            if (id === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        } else if (id === 'home') {
                navigate("/");
            } else {
                navigate(`/#${id}`); 
            }
    };

    return (
        <header className="header-area">
            <nav className="main-nav">
                <h1 className="logo">SCHOLAR</h1>

                <div className="search-input">
                    <input type="text" placeholder="Type Something" />
                    <i className="fa fa-search"></i>
                </div>
                <ul className="nav">
                    <li>
                        <a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault(); 
                                handleScroll('home');
                            }}
                            className="active"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#courses"
                            onClick={(e) => {
                                e.preventDefault();
                                handleScroll('courses');
                            }}
                        >
                            Courses
                        </a>
                    </li>
                    <li>
                        <a
                            href="#team"
                            onClick={(e) => {
                                e.preventDefault();
                                handleScroll('team');
                            }}
                        >
                            Team
                        </a>
                    </li>
                    <li>
                        <a
                            href="#about"
                            onClick={(e) => {
                                e.preventDefault();
                                handleScroll('about');
                            }}
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a href="/signup">
                            Register!
                        </a>
                    </li>
                    <li>
                        <a href="#profile" className="profile-icon">
                            <i className="fa fa-user-circle"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default LandingPageHeader;
