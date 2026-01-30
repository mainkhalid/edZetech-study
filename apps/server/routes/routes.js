const express = require('express');
const router = express.Router();


const programmeController = require('../controllers/programmeController');




router.get('/programmes', programmeController.getAllProgrammes);

// Get programme statistics
router.get('/programmes/stats', programmeController.getProgrammeStats);

// Get programmes by school
router.get('/programmes/school/:school', programmeController.getProgrammesBySchool);
router.get('/programmes/level/:level', programmeController.getProgrammesByLevel);
router.get('/programmes/code/:code', programmeController.getProgrammeByCode);
router.get('/programmes/:id', programmeController.getProgrammeById);
router.post('/programmes', programmeController.createProgramme);
router.put('/programmes/:id', programmeController.updateProgramme);
router.delete('/programmes/:id', programmeController.deleteProgramme);


router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;