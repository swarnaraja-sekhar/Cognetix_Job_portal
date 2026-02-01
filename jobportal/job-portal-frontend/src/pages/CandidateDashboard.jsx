import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CandidateDashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('https://cognetix-job-portal.onrender.com/api/apply/my-applications', config);
                setApplications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user]);

    return (
        <div className="container mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2>Candidate Dashboard</h2>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>

            <div className="card">
                <h3>My Applications</h3>
                <div className="mt-4">
                    {loading ? <p>Loading...</p> : applications.length === 0 ? <p className="text-gray-500">You haven't applied to any jobs yet.</p> : (
                        applications.map(app => (
                            <div key={app._id} className="flex gap-4 justify-between items-center" style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem' }}>
                                <div>
                                    <h4>{app.job?.title || 'Job Removed'}</h4>
                                    <p className="text-gray-500">{app.job?.company || 'Unknown Company'}</p>
                                    <p className="text-sm text-gray-400">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-pending'}`}>
                                    {app.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
