import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center">
                <Link to="/" className="brand">
                    JobPortal
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/jobs" className="nav-link">Jobs</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
