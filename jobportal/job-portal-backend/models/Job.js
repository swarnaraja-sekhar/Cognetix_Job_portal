const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a job title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        salary: {
            type: String,
            required: [true, 'Please add a salary range'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        skills: {
            type: [String],
            required: true,
        },
        experienceLevel: {
            type: String,
            required: [true, 'Please add experience level'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
