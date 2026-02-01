import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h1 className="mb-4">
                Find Your <span style={{ color: 'var(--primary)' }}>Dream Job</span> <br />
                Make It A Reality
            </h1>
            <p className="mb-4" style={{ fontSize: '1.2rem', color: 'var(--gray)', maxWidth: '600px' }}>
                Connect with top employers or find the best talent. The ultimate platform for your career journey.
            </p>

            <div className="flex gap-4 mt-4">
                <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                </Link>
                <Link to="/register" className="btn btn-secondary">
                    Get Started
                </Link>
            </div>

            <div className="mt-4 flex gap-4" style={{ marginTop: '4rem' }}>
                <div className="card text-center" style={{ minWidth: '200px' }}>
                    <h3>10k+</h3>
                    <p>Active Jobs</p>
                </div>
                <div className="card text-center" style={{ minWidth: '200px' }}>
                    <h3>5k+</h3>
                    <p>Companies</p>
                </div>
                <div className="card text-center" style={{ minWidth: '200px' }}>
                    <h3>8k+</h3>
                    <p>Candidates</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
