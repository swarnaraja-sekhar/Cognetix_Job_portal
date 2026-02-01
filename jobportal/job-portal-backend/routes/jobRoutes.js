const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a job
// @route   POST /api/jobs/create
// @access  Private (Employer)
router.post('/create', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const { title, description, company, salary, location, category, skills, experienceLevel } = req.body;

        const job = await Job.create({
            title,
            description,
            company,
            salary,
            location,
            category,
            skills,
            experienceLevel,
            employer: req.user.id,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a job
// @route   PUT /api/jobs/update/:id
// @access  Private (Employer)
router.put('/update/:id', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // specific check: only job owner or admin can update
        if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/delete/:id
// @access  Private (Employer)
router.delete('/delete/:id', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all jobs (public)
// @route   GET /api/jobs/all
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const { keyword, location, category } = req.query;
        let query = { status: 'approved' }; // Only show approved jobs to public

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const jobs = await Job.find(query).populate('employer', 'name company');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name email');
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current employer's jobs
// @route   GET /api/jobs/employer/myjobs
// @access  Private (Employer)
router.get('/employer/myjobs', protect, authorize('employer'), async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
