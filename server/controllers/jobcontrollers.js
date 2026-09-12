const Job = require('../model/JobModel');

const createJob = async (req, res) => {
  try {
    const {title,description,location,tag,Salary}=req.body;

    const job=await Job.create({
      title,
      description,
      location,
      tag,
      Salary,
      employer: req.user.id,
    });
    res.status(201).json({
      message: "Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Something went wrong',error: error.message});
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); 
    res.status(200).json({
    success: true,
    count: jobs.length,
    jobs: jobs,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getJobById=async(req,res)=>{
try{
    const jobById = await Job.findById(req.params.id);
    if(!jobById){
      return res.status(404).json({message:"Invalid Job"});
    }
    res.status(200).json({
      success: true,
      job: jobById,
    });
}

catch(error){
  console.log(error);
  res.status(500).json({message: "Something went wrong", error: error.message})
}
}

const updateJob = async (req, res) => {
  try {
    const jobById = await Job.findById(req.params.id);

    if (!jobById) {
      return res.status(404).json({ message: "Invalid Job" });
    }

    if (jobById.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobById = await Job.findById(req.params.id);

    if (!jobById) {
      return res.status(404).json({ message: "Invalid Job" });
    }

    if (jobById.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this job" });
    }

    await jobById.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports={createJob,getAllJobs,getJobById,updateJob,deleteJob,getMyJobs};
