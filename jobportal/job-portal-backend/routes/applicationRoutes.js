const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');

// Set up Multer for resume uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const checkFileType = (file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Resumes only (PDF, DOC, DOCX)!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Apply to a job
// @route   POST /api/apply/:jobId
// @access  Private (Candidate)
router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: req.params.jobId,
            candidate: req.user.id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume' });
        }

        const application = await Application.create({
            job: req.params.jobId,
            candidate: req.user.id,
            resume: req.file.path,
            coverLetter: req.body.coverLetter,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get my applications
// @route   GET /api/apply/my-applications
// @access  Private (Candidate)
router.get('/my-applications', protect, authorize('candidate'), async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user.id }).populate('job');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get applications for a job (Employer view)
// @route   GET /api/apply/job/:id
// @access  Private (Employer)
router.get('/job/:id', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        // Admin can see all, employer only theirs
        if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.id }).populate('candidate', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
