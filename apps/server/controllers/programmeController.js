const Programme = require('../models/Programme');

exports.getAllProgrammes = async (req, res) => {
  try {
    const { school, level, search, campus } = req.query;
    
    let query = { isActive: true };
    
    if (school) query.school = school;
    
    if (level) query.level = level;
    
    if (campus) query.campuses = { $regex: campus, $options: 'i' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { careers: { $regex: search, $options: 'i' } }
      ];
    }

    const programmes = await Programme.find(query)
      .select('-__v')
      .sort({ level: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: programmes.length,
      data: programmes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programmes',
      error: error.message
    });
  }
};

/* ============================
   Get Programme by ID
============================ */
exports.getProgrammeById = async (req, res) => {
  try {
    const programme = await Programme.findById(req.params.id);

    if (!programme) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found'
      });
    }

    res.status(200).json({
      success: true,
      data: programme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programme',
      error: error.message
    });
  }
};

/* ============================
   Get Programme by Code
============================ */
exports.getProgrammeByCode = async (req, res) => {
  try {
    const programme = await Programme.findOne({ 
      code: req.params.code.toUpperCase() 
    });

    if (!programme) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found'
      });
    }

    res.status(200).json({
      success: true,
      data: programme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programme',
      error: error.message
    });
  }
};
/*create programme*/
exports.createProgramme = async (req, res) => {
  try {
    const {
      id,       
      name,
      level,
      school,
      meanGrade,
      campuses,
      modes,
      description,
      careers,
      goal
    } = req.body;

    // Validate required fields
    if (!name || !id || !level || !school) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, id (code), level, and school'
      });
    }

    const existingProgramme = await Programme.findOne({ code: id.toUpperCase() });
    if (existingProgramme) {
      return res.status(400).json({
        success: false,
        message: 'A programme with this code already exists'
      });
    }

    // Create programme object
    const programmeData = {
      code: id.toUpperCase(),
      name: name.trim(),
      level,
      school,
      meanGrade: meanGrade || '',
      campuses: campuses || '',
      modes: modes || 'Full time, Part time, E-Learning',
      description: description || '',
      careers: careers.filter(c => c.trim() !== ''), // Remove empty careers
      goal: goal || ''
    };

    const programme = await Programme.create(programmeData);

    res.status(201).json({
      success: true,
      message: 'Programme created successfully',
      data: programme
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A programme with this code already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating programme',
      error: error.message
    });
  }
};

/*update programme*/
exports.updateProgramme = async (req, res) => {
  try {
    const {
      id,        
      name,
      level,
      school,
      meanGrade,
      campuses,
      modes,
      description,
      careers,
      goal
    } = req.body;

    // Find programme by ID 
    const existingProgramme = await Programme.findById(req.params.id);
    
    if (!existingProgramme) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found'
      });
    }

    if (id && id.toUpperCase() !== existingProgramme.code) {
      const codeExists = await Programme.findOne({ 
        code: id.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: 'A programme with this code already exists'
        });
      }
    }

    // Update programme data
    const updateData = {
      ...(id && { code: id.toUpperCase() }),
      ...(name && { name: name.trim() }),
      ...(level && { level }),
      ...(school && { school }),
      meanGrade: meanGrade || '',
      campuses: campuses || '',
      modes: modes || 'Full time, Part time, E-Learning',
      description: description || '',
      careers: careers ? careers.filter(c => c.trim() !== '') : existingProgramme.careers,
      goal: goal || ''
    };

    const programme = await Programme.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Programme updated successfully',
      data: programme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating programme',
      error: error.message
    });
  }
};


/*delete programme*/
exports.deleteProgramme = async (req, res) => {
  try {
    const programme = await Programme.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!programme) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Programme deactivated successfully',
      data: programme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting programme',
      error: error.message
    });
  }
};

/*programme by school*/
exports.getProgrammesBySchool = async (req, res) => {
  try {
    const { school } = req.params;
    
    const programmes = await Programme.find({
      school: school.toLowerCase(),
      isActive: true
    }).sort({ level: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: programmes.length,
      data: programmes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programmes by school',
      error: error.message
    });
  }
};

/*programme by level*/
exports.getProgrammesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    
    const programmes = await Programme.find({
      level,
      isActive: true
    }).sort({ school: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: programmes.length,
      data: programmes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programmes by level',
      error: error.message
    });
  }
};

/*programme stats*/
exports.getProgrammeStats = async (req, res) => {
  try {
    const totalActive = await Programme.countDocuments({ isActive: true });
    const totalInactive = await Programme.countDocuments({ isActive: false });
    
    const bySchool = await Programme.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$school',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const byLevel = await Programme.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalActive,
        inactive: totalInactive,
        bySchool,
        byLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programme statistics',
      error: error.message
    });
  }
};

module.exports = exports;