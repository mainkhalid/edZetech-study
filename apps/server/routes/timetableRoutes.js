const express = require('express');
const router = express.Router();
const multer = require('multer');
const timetableController = require('../controllers/timetableController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .xlsx, .xls, and .csv files are allowed'));
    }
  }
});

router.post('/upload', upload.single('timetable'), timetableController.uploadTimetable);
router.get('/', timetableController.getAllTimetables);
router.get('/periods', timetableController.getAvailablePeriods);
router.post('/query', timetableController.querySessions);
router.get('/unit/:unitCode', timetableController.getSessionsByUnit);
router.get('/lecturer/:lecturerName', timetableController.getSessionsByLecturer);
router.get('/:school/:academicYear/:semester', timetableController.getTimetable);
router.get('/:id/metadata', timetableController.getMetadata);
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;