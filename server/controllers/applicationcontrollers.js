const Application = require('../model/ApplicationModel');
const Job = require('../model/JobModel');

const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const candidateId = req.user.id;
    const { resumeUrl } = req.body;

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: candidateId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      resumeUrl,
    });

    res.status(201).json({
      message: "Applied to job successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Job is not applied by you" }); 
    }

    const applications = await Application.find({ job: req.params.id }).populate('candidate');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Applicant status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const allApplications = await Application.find({ candidate: req.user.id }).populate('job');

    res.status(200).json({
      success: true,
      count: allApplications.length,
      applications: allApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something Went wrong", error: error.message });
  }
};
module.exports = { applyToJob, getApplicantsForJob, updateApplicantStatus,getMyApplications };