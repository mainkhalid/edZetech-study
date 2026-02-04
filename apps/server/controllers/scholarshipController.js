const Scholarship = require('../models/Scholarship');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');


const parseArrayField = (field) => {
  if (!field) return [];
  
  if (Array.isArray(field)) {
    return field
      .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter(item => item.length > 0);
  }

  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
          .filter(item => item.length > 0);
      }
    } catch (e) {
      return field
        .split(/\n|;|\|/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
  }
  
  return [];
};

// Create new scholarship
const createScholarship = async (req, res) => {
  try {
    const scholarshipData = {
      name: req.body.name,
      provider: req.body.provider,
      amount: req.body.amount,
      deadline: req.body.deadline,
      eligibility: req.body.eligibility,
      description: req.body.description,
      applicationUrl: req.body.applicationUrl,
      contactEmail: req.body.contactEmail,
    };

    scholarshipData.requirements = parseArrayField(req.body.requirements);
    scholarshipData.tags = parseArrayField(req.body.tags);

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'scholarships/thumbnails',
          maxWidth: 1200,
          maxHeight: 800,
          format: 'jpg',
          quality: 'auto:good'
        });

        scholarshipData.thumbnail = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload thumbnail image',
          error: uploadError.message
        });
      }
    }

    if (req.user) {
      scholarshipData.createdBy = req.user._id;
    }

    const scholarship = await Scholarship.create(scholarshipData);

    return res.status(201).json({
      success: true,
      message: 'Scholarship created successfully',
      data: scholarship
    });
  } catch (error) {
    console.error('Create scholarship error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create scholarship',
      error: error.message
    });
  }
};

// Get all scholarships
const getAllScholarships = async (req, res) => {
  try {
    const { 
      eligibility, 
      applicationsOpen,
      published, 
      page = 1, 
      limit = 10,
      sort = '-deadline'
    } = req.query;

    const query = {};
    
    if (eligibility) query.eligibility = eligibility;
    if (applicationsOpen !== undefined) query.applicationsOpen = applicationsOpen === 'true';
    if (published !== undefined) query.published = published === 'true';

    const skip = (page - 1) * limit;

    const scholarships = await Scholarship.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'name email');

    const total = await Scholarship.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: scholarships,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all scholarships error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scholarships',
      error: error.message
    });
  }
};

// Get single scholarship
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Get scholarship by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scholarship',
      error: error.message
    });
  }
};

// Update scholarship
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Handle thumbnail upload if new file
    if (req.file) {
      if (scholarship.thumbnail && scholarship.thumbnail.publicId) {
        try {
          await deleteFromCloudinary(scholarship.thumbnail.publicId);
        } catch (deleteError) {
          console.error('Failed to delete old thumbnail:', deleteError);
        }
      }

      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'scholarships/thumbnails',
          maxWidth: 1200,
          maxHeight: 800,
          format: 'jpg',
          quality: 'auto:good'
        });

        req.body.thumbnail = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload new thumbnail',
          error: uploadError.message
        });
      }
    }

    // Parse array fields if they're being updated
    if (req.body.requirements !== undefined) {
      req.body.requirements = parseArrayField(req.body.requirements);
    }
    
    if (req.body.tags !== undefined) {
      req.body.tags = parseArrayField(req.body.tags);
    }

    const allowedUpdates = [
      'name', 'provider', 'amount', 'deadline', 'eligibility',
      'description', 'requirements', 'thumbnail', 'tags',
      'published', 'applicationsOpen', 'applicationUrl', 'contactEmail'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        scholarship[field] = req.body[field];
      }
    });

    await scholarship.save();

    return res.status(200).json({
      success: true,
      message: 'Scholarship updated successfully',
      data: scholarship
    });
  } catch (error) {
    console.error('Update scholarship error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to update scholarship',
      error: error.message
    });
  }
};

// Delete scholarship
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Delete thumbnail from Cloudinary if exists
    if (scholarship.thumbnail && scholarship.thumbnail.publicId) {
      try {
        await deleteFromCloudinary(scholarship.thumbnail.publicId);
      } catch (deleteError) {
        console.error('Failed to delete thumbnail:', deleteError);
      }
    }

    await scholarship.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Scholarship deleted successfully'
    });
  } catch (error) {
    console.error('Delete scholarship error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scholarship',
      error: error.message
    });
  }
};

// Publish/unpublish scholarship
const togglePublishStatus = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    if (scholarship.published) {
      await scholarship.unpublish();
    } else {
      await scholarship.publish();
    }

    return res.status(200).json({
      success: true,
      message: `Scholarship ${scholarship.published ? 'published' : 'unpublished'} successfully`,
      data: scholarship
    });
  } catch (error) {
    console.error('Toggle publish status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle publish status',
      error: error.message
    });
  }
};

// Toggle applications open/closed
const toggleApplicationStatus = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    if (scholarship.applicationsOpen) {
      await scholarship.closeApplications();
    } else {
      await scholarship.openApplications();
    }

    return res.status(200).json({
      success: true,
      message: `Applications ${scholarship.applicationsOpen ? 'opened' : 'closed'} successfully`,
      data: scholarship
    });
  } catch (error) {
    console.error('Toggle application status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle application status',
      error: error.message
    });
  }
};

const getActiveScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.findActive();

    return res.status(200).json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Get active scholarships error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active scholarships',
      error: error.message
    });
  }
};

const getScholarshipsByEligibility = async (req, res) => {
  try {
    const { eligibility } = req.params;
    const scholarships = await Scholarship.findByEligibility(eligibility);

    return res.status(200).json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Get scholarships by eligibility error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scholarships by eligibility',
      error: error.message
    });
  }
};

// Get scholarships expiring soon
const getExpiringSoon = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const scholarships = await Scholarship.findExpiringSoon(parseInt(days));

    return res.status(200).json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Get expiring scholarships error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve expiring scholarships',
      error: error.message
    });
  }
};

module.exports = {
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
};