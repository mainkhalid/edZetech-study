const School = require('../models/School');
const Programme = require('../models/Programme');

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({ isActive: true })
      .select('-__v')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching schools',
      error: error.message
    });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const programmes = await Programme.find({ 
      school: school._id, 
      isActive: true 
    }).select('name code level duration studyMode');

    res.status(200).json({
      success: true,
      data: {
        school,
        programmes,
        programmeCount: programmes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching school',
      error: error.message
    });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);

    res.status(201).json({
      success: true,
      data: school
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating school',
      error: error.message
    });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating school',
      error: error.message
    });
  }
};