import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobListing = () => {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        category: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const { data } = await axios.get(`http://localhost:5000/api/jobs/all?${query}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h2>Find Your Perfect Job</h2>
                <p className="text-gray-500">Browse thousands of job openings</p>
            </div>

            <div className="card mb-4" style={{ background: 'var(--light)', padding: '1.5rem' }}>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="form-group mb-0" style={{ flex: 1 }}>
                        <input
                            name="keyword"
                            placeholder="Job title, keywords, or company"
                            className="form-input"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="form-group mb-0" style={{ flex: 1 }}>
                        <input
                            name="location"
                            placeholder="City or state"
                            className="form-input"
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="form-group mb-0" style={{ flex: 1 }}>
                        <select
                            name="category"
                            className="form-select"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            <option value="IT">IT & Software</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">Human Resources</option>
                            <option value="Design">Design</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '46px', alignSelf: 'flex-end', marginBottom: '1px' }}>
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <p className="text-center">Loading jobs...</p>
            ) : (
                <div className="grid gap-4">
                    {jobs.length === 0 ? (
                        <p className="text-center">No jobs found matching your criteria.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="card flex justify-between items-center" style={{ padding: '1.5rem', transition: 'all 0.2s' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                                    <p style={{ color: 'var(--gray)', fontWeight: 500 }}>{job.company} • {job.location}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="badge badge-success" style={{ background: '#e0e7ff', color: '#4338ca' }}>{job.category}</span>
                                        <span className="badge badge-success" style={{ background: '#f1f5f9', color: '#475569' }}>{job.experienceLevel}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{job.salary}</span>
                                    <Link to={`/job/${job._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>View Details</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default JobListing;
