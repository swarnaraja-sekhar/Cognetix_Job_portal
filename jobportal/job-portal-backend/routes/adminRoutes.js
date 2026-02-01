const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');

// ... (Existing content)

// @desc    Get all pending jobs
// @route   GET /api/admin/jobs/pending
// @access  Private (Admin)
router.get('/jobs/pending', protect, authorize('admin'), async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'pending' }).populate('employer', 'name company');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve/Reject Job
// @route   PUT /api/admin/job/:status/:id
// @access  Private (Admin)
// status: approve or reject
router.put('/job/:status/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, id } = req.params;

        // Map URL status to DB status
        let dbStatus;
        if (status === 'approve') dbStatus = 'approved';
        else if (status === 'reject') dbStatus = 'rejected';
        else return res.status(400).json({ message: 'Invalid status action' });

        const job = await Job.findByIdAndUpdate(
            id,
            { status: dbStatus },
            { new: true }
        );

        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve/Reject Application
// @route   PUT /api/admin/apply/:status/:id
// @access  Private (Admin)
router.put('/apply/:status/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, id } = req.params;

        let dbStatus;
        if (status === 'approve') dbStatus = 'accepted';
        else if (status === 'reject') dbStatus = 'rejected';
        else return res.status(400).json({ message: 'Invalid status action' });

        const application = await Application.findByIdAndUpdate(
            id,
            { status: dbStatus },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: 'Application not found' });

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
