const {createJob,getAllJobs,getJobById,updateJob,deleteJob,getMyJobs}=require('../controllers/jobcontrollers');
const verifyToken=require('../middleware/verifyToken');
const roleCheck=require('../middleware/roleCheck');

const router=require('express').Router();
router.get('/jobs', getAllJobs);
router.post('/jobs', verifyToken, roleCheck('employer'), createJob);
router.put('/jobs/:id', verifyToken, roleCheck('employer'), updateJob);
router.get('/jobs/:id', getJobById);
router.delete('/jobs/:id', verifyToken, roleCheck('employer'), deleteJob);
router.get('/my-jobs', verifyToken, roleCheck('employer'), getMyJobs);

module.exports=router
