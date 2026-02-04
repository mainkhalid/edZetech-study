const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createResearchProject,
  getAllResearchProjects,
  getResearchProjectById,
  updateResearchProject,
  deleteResearchProject,
  togglePublishStatus,
  getProjectsByDepartment,
  getActiveProjects
} = require('../controllers/researchController');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// GET routes
router.get('/', getAllResearchProjects);
router.get('/active', getActiveProjects);
router.get('/department/:department', getProjectsByDepartment);
router.get('/:id', getResearchProjectById);

// POST route
router.post(
  '/',
  upload.single('thumbnail'),
  createResearchProject
);

// PUT route
router.put(
  '/:id',
  upload.single('thumbnail'),
  updateResearchProject
);

// PATCH route
router.patch(
  '/:id/publish',
  togglePublishStatus
);

// DELETE route
router.delete(
  '/:id',
  deleteResearchProject
);

// Error handler middleware - MUST be defined after all routes
const errorHandler = (err, req, res, next) => {
  console.error('Route error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (Max 5MB)' : err.message
    });
  }
  
  // Handle file filter errors
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Default error response
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: err.message 
  });
};

// Apply error handler - this catches errors from all routes above
router.use(errorHandler);

module.exports = router;