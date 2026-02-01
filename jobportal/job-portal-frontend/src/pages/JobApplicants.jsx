import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const JobApplicants = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`http://localhost:5000/api/apply/job/${id}`, config);
                setApplicants(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id, user]);

    return (
        <div className="container mt-4">
            <h2>Applicants for Job</h2>

            <div className="card mt-4">
                <div className="mt-4">
                    {loading ? <p>Loading...</p> : applicants.length === 0 ? <p>No applicants yet.</p> : (
                        applicants.map(app => (
                            <div key={app._id} className="flex justify-between items-center" style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
                                <div>
                                    <h4>{app.candidate.name}</h4>
                                    <p className="text-gray-500">{app.candidate.email}</p>
                                    {app.coverLetter && <p className="text-sm mt-1" style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>"{app.coverLetter}"</p>}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}>View Resume</a>
                                    <span className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-pending'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicants;
