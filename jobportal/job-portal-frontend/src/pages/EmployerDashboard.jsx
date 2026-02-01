import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('https://cognetix-job-portal.onrender.com/api/jobs/employer/myjobs', config);
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`https://cognetix-job-portal.onrender.com/api/jobs/delete/${id}`, config);
            fetchJobs(); // Refresh
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="container mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2>Employer Dashboard</h2>
                <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
            </div>

            <div className="card mb-4">
                <h3>Your Job Postings</h3>
                <div className="mt-4">
                    {loading ? <p>Loading...</p> : jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                        jobs.map(job => (
                            <div key={job._id} className="flex justify-between items-center" style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
                                <div>
                                    <h4>{job.title}</h4>
                                    <p className="text-gray-500">{job.location} • {job.salary}</p>
                                    <p className="text-sm">Status: <span className={`badge ${job.status === 'approved' ? 'badge-success' : job.status === 'rejected' ? 'badge-danger' : 'badge-pending'}`}>{job.status}</span></p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    <Link to={`/job/${job._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View Job</Link>
                                    <Link to={`/job/${job._id}/applicants`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Applicants</Link>
                                    <button onClick={() => handleDelete(job._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: 'none' }}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
