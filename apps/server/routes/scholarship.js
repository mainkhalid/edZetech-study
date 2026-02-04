const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  togglePublishStatus,
  toggleApplicationStatus,
  getActiveScholarships,
  getScholarshipsByEligibility,
  getExpiringSoon
} = require('../controllers/scholarshipController');


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.get('/active', getActiveScholarships);
router.get('/expiring', getExpiringSoon);
router.get('/eligibility/:eligibility', getScholarshipsByEligibility);
router.get('/:id', getScholarshipById);
router.get('/', getAllScholarships);

// Protected routes (uncomment and add auth middleware as needed)
router.post('/', upload.single('thumbnail'), createScholarship);
router.put('/:id', upload.single('thumbnail'), updateScholarship);
router.delete('/:id', deleteScholarship);
router.patch('/:id/publish', togglePublishStatus);
router.patch('/:id/applications', toggleApplicationStatus);

module.exports = router;