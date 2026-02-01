import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    // Application State
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`https://cognetix-job-portal.onrender.com/api/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) {
            setError('Please upload a resume');
            return;
        }

        setApplying(true);
        setError('');
        setMessage('');

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('coverLetter', coverLetter);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post(`https://cognetix-job-portal.onrender.com/api/apply/${id}`, formData, config);
            setMessage('Application submitted successfully!');
            setResume(null);
            setCoverLetter('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (!job) return <div className="container mt-4">Job not found</div>;

    return (
        <div className="container mt-4 mb-4">
            <div className="card mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 style={{ fontSize: '2rem' }}>{job.title}</h1>
                        <p className="text-xl text-gray-500">{job.company}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-success" style={{ background: '#e0e7ff', color: '#4338ca' }}>{job.category}</span>
                            <span className="badge badge-success" style={{ background: '#f1f5f9', color: '#475569' }}>{job.location}</span>
                            <span className="badge badge-success" style={{ background: '#dcfce7', color: '#166534' }}>{job.salary}</span>
                        </div>
                    </div>
                    {user?.role === 'employer' && user._id === job.employer._id && (
                        <button className="btn btn-secondary">Edit Job</button>
                    )}
                </div>

                <div className="mt-4" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <h3>Job Description</h3>
                    <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
                </div>

                <div className="mt-4">
                    <h3>Required Skills</h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {job.skills.map(skill => (
                            <span key={skill} className="badge" style={{ background: '#f3f4f6' }}>{skill}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Section */}
            {user?.role === 'candidate' && (
                <div className="card">
                    <h3>Apply for this position</h3>
                    {message && <div className="badge badge-success mb-4" style={{ display: 'block' }}>{message}</div>}
                    {error && <div className="badge badge-danger mb-4" style={{ display: 'block' }}>{error}</div>}

                    <form onSubmit={handleApply} className="mt-4">
                        <div className="form-group">
                            <label className="form-label">Upload Resume (PDF/DOC)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="form-input"
                                onChange={(e) => setResume(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cover Letter (Optional)</label>
                            <textarea
                                className="form-textarea"
                                rows="3"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={applying}>
                            {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            )}

            {!user && (
                <div className="card text-center">
                    <h3>Interested in this job?</h3>
                    <div className="mt-2">
                        <button onClick={() => navigate('/login')} className="btn btn-primary">Login to Apply</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
