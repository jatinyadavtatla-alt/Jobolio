const router =require('express').Router();

const verifyToken = require('../middleware/verifyToken');
const roleCheck = require('../middleware/roleCheck');
const { applyToJob,getApplicantsForJob,updateApplicantStatus,getMyApplications } = require('../controllers/applicationcontrollers');

router.post('/jobs/:id/apply', verifyToken, roleCheck('candidate'), applyToJob);
router.get('/jobs/:id/applicants',verifyToken,roleCheck('employer'),getApplicantsForJob);
router.put('/applications/:id/status', verifyToken, roleCheck('employer'), updateApplicantStatus);
router.get('/my-applications', verifyToken, roleCheck('candidate'), getMyApplications);
module.exports = router;