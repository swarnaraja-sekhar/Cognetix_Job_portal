# Job Portal System

A full-stack Job Portal application built with MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication**: JWT-based auth with Role-Based Access Control (Admin, Employer, Candidate).
- **Candidate**:
  - Browse and Filter Jobs (Category, Location, etc).
  - Apply to Jobs with Resume (PDF/DOC) upload.
  - Track application status.
- **Employer**:
  - Post, Edit, Delete Jobs.
  - View Applicants for posted jobs.
  - Download Candidate Resumes.
- **Admin**:
  - Approve/Reject Job Postings.
  - Approve/Reject Applications.
  - Dashboard overview.

## Prerequisites

- Node.js installed.
- MongoDB installed and running locally (or use Atlas URI).

## Setup & Run

### 1. Backend

```bash
cd job-portal-backend
# Install dependencies
npm install
# Start Server (at port 5000)
npm start
```

*Note: Ensure `.env` is configured correctly (default uses local MongoDB).*

### 2. Frontend

```bash
cd job-portal-frontend
# Install dependencies
npm install
# Start React App (at port 5173)
npm run dev
```

## Default Credentials

Register a new user to test different roles.
- Select **Candidate** to apply.
- Select **Employer** to post jobs.
- Manually change a user's role to **'admin'** in MongoDB to access Admin Dashboard (or create a seed script).

## Tech Stack

- **Frontend**: React, Vite, Context API, Axios, Vanilla CSS (Premium Design).
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **File Storage**: Local `uploads/` folder (Multer).
