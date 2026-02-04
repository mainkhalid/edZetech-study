const ResearchProject = require('../models/ResearchProject');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// Create new research
const createResearchProject = async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      lead: req.body.lead,
      department: req.body.department,
      funding: req.body.funding,
      status: req.body.status,
      abstract: req.body.abstract,
    };

    // Parse milestones if it's a JSON string
    if (req.body.milestones) {
      try {
        projectData.milestones = typeof req.body.milestones === 'string' 
          ? JSON.parse(req.body.milestones) 
          : req.body.milestones;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid milestones format',
          error: parseError.message
        });
      }
    } else {
      projectData.milestones = [];
    }

    // Parse tags if it's a JSON string
    if (req.body.tags) {
      try {
        projectData.tags = typeof req.body.tags === 'string' 
          ? JSON.parse(req.body.tags) 
          : req.body.tags;
      } catch (parseError) {
        console.warn('Failed to parse tags, using empty array:', parseError);
        projectData.tags = [];
      }
    } else {
      projectData.tags = [];
    }

    // Parse collaborators if it's a JSON string
    if (req.body.collaborators) {
      try {
        projectData.collaborators = typeof req.body.collaborators === 'string' 
          ? JSON.parse(req.body.collaborators) 
          : req.body.collaborators;
      } catch (parseError) {
        console.warn('Failed to parse collaborators, using empty array:', parseError);
        projectData.collaborators = [];
      }
    } else {
      projectData.collaborators = [];
    }

    // Handle thumbnail upload
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'research-projects/thumbnails',
          maxWidth: 1200,
          maxHeight: 800,
          format: 'jpg',
          quality: 'auto:good'
        });

        projectData.thumbnail = {
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
      projectData.createdBy = req.user._id;
    }

    const project = await ResearchProject.create(projectData);

    return res.status(201).json({
      success: true,
      message: 'Research project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create research project error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create research project',
      error: error.message
    });
  }
};

// Get all research projects
const getAllResearchProjects = async (req, res) => {
  try {
    const { 
      department, 
      status, 
      published, 
      page = 1, 
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (published !== undefined) query.published = published === 'true';

    const skip = (page - 1) * limit;

    const projects = await ResearchProject.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'name email');

    const total = await ResearchProject.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all research projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve research projects',
      error: error.message
    });
  }
};

// Get single research project
const getResearchProjectById = async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get research project by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve research project',
      error: error.message
    });
  }
};

// Update research project
const updateResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }
    if (req.file) {
      if (project.thumbnail && project.thumbnail.publicId) {
        try {
          await deleteFromCloudinary(project.thumbnail.publicId);
        } catch (deleteError) {
          console.error('Failed to delete old thumbnail:', deleteError);
        }
      }
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'research-projects/thumbnails',
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

    const allowedUpdates = [
      'title', 'lead', 'department', 'funding', 'status', 
      'abstract', 'milestones', 'thumbnail', 'tags', 
      'collaborators', 'published'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Research project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update research project error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to update research project',
      error: error.message
    });
  }
};

// Delete project
const deleteResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }

    // Delete thumbnail from Cloudinary if exists
    if (project.thumbnail && project.thumbnail.publicId) {
      try {
        await deleteFromCloudinary(project.thumbnail.publicId);
      } catch (deleteError) {
        console.error('Failed to delete thumbnail:', deleteError);
      }
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Research project deleted successfully'
    });
  } catch (error) {
    console.error('Delete research project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete research project',
      error: error.message
    });
  }
};

// Publish/unpublish
const togglePublishStatus = async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }

    if (project.published) {
      await project.unpublish();
    } else {
      await project.publish();
    }

    return res.status(200).json({
      success: true,
      message: `Research project ${project.published ? 'published' : 'unpublished'} successfully`,
      data: project
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

// Get projects by department
const getProjectsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const projects = await ResearchProject.findByDepartment(department);

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects by department error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects by department',
      error: error.message
    });
  }
};

// Get active projects
const getActiveProjects = async (req, res) => {
  try {
    const projects = await ResearchProject.findActive();

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get active projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active projects',
      error: error.message
    });
  }
};

module.exports = {
  createResearchProject,
  getAllResearchProjects,
  getResearchProjectById,
  updateResearchProject,
  deleteResearchProject,
  togglePublishStatus,
  getProjectsByDepartment,
  getActiveProjects
};