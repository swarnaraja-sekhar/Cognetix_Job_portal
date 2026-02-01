import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        salary: '',
        location: '',
        category: '',
        skills: '', // Comma separated
        experienceLevel: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(skill => skill.trim()),
            };

            await axios.post('http://localhost:5000/api/jobs/create', jobData, config);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-4 mb-4">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="mb-4">Post a New Job</h2>
                {error && <div className="badge badge-danger mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Job Title</label>
                        <input name="title" className="form-input" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input name="company" className="form-input" onChange={handleChange} required />
                    </div>

                    <div className="flex gap-4">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Location</label>
                            <input name="location" className="form-input" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Salary Range</label>
                            <input name="salary" className="form-input" placeholder="e.g. $80k - $120k" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="IT">IT & Software</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance</option>
                                <option value="HR">Human Resources</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Experience Level</label>
                            <select name="experienceLevel" className="form-select" onChange={handleChange} required>
                                <option value="">Select Level</option>
                                <option value="Entry">Entry Level</option>
                                <option value="Mid">Mid Level</option>
                                <option value="Senior">Senior Level</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Skills (Comma separated)</label>
                        <input name="skills" className="form-input" placeholder="React, Node.js, MongoDB" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Job Description</label>
                        <textarea name="description" className="form-textarea" rows="5" onChange={handleChange} required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit Job Post</button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
