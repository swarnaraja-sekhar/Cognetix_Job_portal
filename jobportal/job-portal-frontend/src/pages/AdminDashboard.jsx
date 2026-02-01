import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const fetchPendingJobs = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('https://cognetix-job-portal.onrender.com/api/admin/jobs/pending', config);
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    const handleAction = async (id, action) => {
        // action: 'approve' or 'reject'
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`https://cognetix-job-portal.onrender.com/api/admin/job/${action}/${id}`, {}, config);
            // Remove from list
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>

            <div className="card mt-4">
                <h3>Pending Job Approvals</h3>
                <div className="mt-4">
                    {loading ? <p>Loading...</p> : jobs.length === 0 ? <p>No pending jobs.</p> : (
                        jobs.map(job => (
                            <div key={job._id} className="flex justify-between items-center" style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
                                <div>
                                    <h4>{job.title}</h4>
                                    <p className="text-gray-500">{job.employer.name} ({job.employer.company}) • {job.createdAt.substring(0, 10)}</p>
                                    <p className="text-sm mt-1">{job.description.substring(0, 100)}...</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(job._id, 'approve')} className="btn btn-success" style={{ background: '#d1fae5', color: '#065f46' }}>Approve</button>
                                    <button onClick={() => handleAction(job._id, 'reject')} className="btn btn-danger" style={{ background: '#fee2e2', color: '#991b1b' }}>Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
