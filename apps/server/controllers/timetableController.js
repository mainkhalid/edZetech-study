const Timetable = require('../models/Timetable');
const TimetableParser = require('../utils/timetableParser');

/**
 * Timetable Controller
 * Handles all timetable-related operations
 */

const timetableController = {
  /**
   * Upload and parse Excel timetable
   * POST /api/timetables/upload
   */
  uploadTimetable: async (req, res) => {
    try {
      // Validate request
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please upload an Excel file (.xlsx or .xls)'
        });
      }

      const { school, schoolName, academicYear, semester, notes, uploadedBy } = req.body;

      // Validate required fields
      if (!school || !schoolName || !academicYear || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: school, schoolName, academicYear, semester'
        });
      }

      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Please upload .xlsx, .xls, or .csv file'
        });
      }

      console.log(`Processing timetable upload: ${req.file.originalname}`);
      console.log(`School: ${school}, Year: ${academicYear}, Semester: ${semester}`);

      // Parse the Excel file
      const parser = new TimetableParser();
      const parseResult = await parser.parseFile(req.file.buffer, req.file.originalname);

      if (!parseResult.success || parseResult.sessions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to parse timetable file',
          errors: parseResult.errors || [],
          parseReport: {
            errors: parseResult.errors || [],
            warnings: []
          }
        });
      }

      // Calculate metadata from parsed sessions
      const uniqueUnits = [...new Set(parseResult.sessions.map(s => s.unitCode))];
      const lecturers = [...new Set(parseResult.sessions.map(s => s.lecName))];
      const rooms = [...new Set(parseResult.sessions.map(s => s.room))];

      // Check if timetable already exists for this period
      const existingTimetable = await Timetable.findOne({
        school,
        academicYear,
        semester,
        status: 'published'
      });
      
      let timetable;
      if (existingTimetable) {
        // Archive the old version
        existingTimetable.status = 'archived';
        await existingTimetable.save();

        // Create new version
        timetable = new Timetable({
          school,
          schoolName,
          academicYear,
          semester,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          sessions: parseResult.sessions,
          notes: notes || '',
          status: 'published',
          version: existingTimetable.version + 1,
          uploadedBy: uploadedBy || 'admin',
          metadata: {
            totalSessions: parseResult.sessions.length,
            uniqueUnits: uniqueUnits,
            lecturers: lecturers,
            rooms: rooms,
            parsedRows: parseResult.stats.parsedSessions,
            errorRows: parseResult.stats.errorCount,
            warnings: []
          }
        });
      } else {
        // Create new timetable
        timetable = new Timetable({
          school,
          schoolName,
          academicYear,
          semester,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          sessions: parseResult.sessions,
          notes: notes || '',
          status: 'published',
          version: 1,
          uploadedBy: uploadedBy || 'admin',
          metadata: {
            totalSessions: parseResult.sessions.length,
            uniqueUnits: uniqueUnits,
            lecturers: lecturers,
            rooms: rooms,
            parsedRows: parseResult.stats.parsedSessions,
            errorRows: parseResult.stats.errorCount,
            warnings: []
          }
        });
      }

      await timetable.save();

      res.status(201).json({
        success: true,
        message: 'Timetable uploaded and parsed successfully',
        data: {
          timetableId: timetable._id,
          school: timetable.school,
          academicYear: timetable.academicYear,
          semester: timetable.semester,
          version: timetable.version,
          stats: {
            totalSessions: parseResult.sessions.length,
            uniqueUnits: uniqueUnits.length,
            lecturers: lecturers.length,
            rooms: rooms.length,
            parsedRows: parseResult.stats.parsedSessions,
            errorRows: parseResult.stats.errorCount,
            warnings: 0
          },
          metadata: timetable.metadata
        },
        parseReport: {
          errors: parseResult.errors || [],
          warnings: []
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during timetable upload',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  /**
   * Get timetable by school and period
   * GET /api/timetables/:school/:academicYear/:semester
   */
  getTimetable: async (req, res) => {
    try {
      const { school, academicYear, semester } = req.params;

      const timetable = await Timetable.findOne({
        school,
        academicYear,
        semester,
        status: 'published'
      });

      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found for the specified period'
        });
      }

      res.json({
        success: true,
        data: timetable
      });

    } catch (error) {
      console.error('Get timetable error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving timetable',
        error: error.message
      });
    }
  },

  /**
   * Get all timetables (with optional filters)
   * GET /api/timetables
   */
  getAllTimetables: async (req, res) => {
    try {
      const { school, academicYear, semester, status } = req.query;
      
      const query = {};
      if (school) query.school = school;
      if (academicYear) query.academicYear = academicYear;
      if (semester) query.semester = semester;
      if (status) query.status = status;
      else query.status = 'published'; // Default to published only

      const timetables = await Timetable.find(query)
        .select('-sessions') // Exclude sessions for list view
        .sort({ academicYear: -1, semester: -1, createdAt: -1 });

      res.json({
        success: true,
        count: timetables.length,
        data: timetables
      });

    } catch (error) {
      console.error('Get all timetables error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving timetables',
        error: error.message
      });
    }
  },

  /**
   * Search/Query sessions (AI-ready endpoint)
   * POST /api/timetables/query
   */
  querySessions: async (req, res) => {
    try {
      const {
        school,
        academicYear,
        semester,
        unitCode,
        lecturer,
        room,
        day,
        searchText
      } = req.body;

      // Build query
      const query = { status: 'published' };
      
      if (school) query.school = school;
      if (academicYear) query.academicYear = academicYear;
      if (semester) query.semester = semester;

      const timetables = await Timetable.find(query);

      // Extract and filter matching sessions
      let matchingSessions = [];
      timetables.forEach(timetable => {
        const filtered = timetable.sessions.filter(session => {
          let match = true;
          
          if (unitCode && session.unitCode !== unitCode.toUpperCase()) match = false;
          if (lecturer && !session.lecName.toLowerCase().includes(lecturer.toLowerCase())) match = false;
          if (room && !session.room.toLowerCase().includes(room.toLowerCase())) match = false;
          if (day && session.day !== day) match = false;
          
          if (searchText) {
            const text = searchText.toLowerCase();
            match = match && (
              session.unitCode.toLowerCase().includes(text) ||
              session.unitTitle.toLowerCase().includes(text) ||
              session.lecName.toLowerCase().includes(text) ||
              session.room.toLowerCase().includes(text)
            );
          }
          
          return match;
        });

        matchingSessions.push(...filtered.map(session => ({
          ...session.toObject(),
          timetableId: timetable._id,
          school: timetable.school,
          academicYear: timetable.academicYear,
          semester: timetable.semester
        })));
      });

      res.json({
        success: true,
        count: matchingSessions.length,
        data: matchingSessions,
        query: req.body
      });

    } catch (error) {
      console.error('Query sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Error querying sessions',
        error: error.message
      });
    }
  },

  /**
   * Get sessions by unit code
   * GET /api/timetables/unit/:unitCode
   */
  getSessionsByUnit: async (req, res) => {
    try {
      const { unitCode } = req.params;
      const { academicYear, semester } = req.query;

      const query = {
        status: 'published',
        'sessions.unitCode': unitCode.toUpperCase()
      };

      if (academicYear) query.academicYear = academicYear;
      if (semester) query.semester = semester;

      const timetables = await Timetable.find(query);

      if (!timetables || timetables.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No timetable found with this unit code'
        });
      }

      let sessions = [];
      timetables.forEach(timetable => {
        const unitSessions = timetable.sessions.filter(
          s => s.unitCode === unitCode.toUpperCase()
        );
        sessions.push(...unitSessions.map(s => ({
          ...s.toObject(),
          school: timetable.school,
          academicYear: timetable.academicYear,
          semester: timetable.semester
        })));
      });

      res.json({
        success: true,
        unitCode: unitCode.toUpperCase(),
        count: sessions.length,
        data: sessions
      });

    } catch (error) {
      console.error('Get sessions by unit error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving sessions by unit',
        error: error.message
      });
    }
  },

  /**
   * Get sessions by lecturer
   * GET /api/timetables/lecturer/:lecturerName
   */
  getSessionsByLecturer: async (req, res) => {
    try {
      const { lecturerName } = req.params;
      const { academicYear, semester } = req.query;

      const query = {
        status: 'published'
      };

      if (academicYear) query.academicYear = academicYear;
      if (semester) query.semester = semester;

      const timetables = await Timetable.find(query);

      let allSessions = [];
      timetables.forEach(timetable => {
        const sessions = timetable.sessions.filter(s =>
          s.lecName.toLowerCase().includes(lecturerName.toLowerCase())
        );
        allSessions.push(...sessions.map(s => ({
          ...s.toObject(),
          school: timetable.school,
          academicYear: timetable.academicYear,
          semester: timetable.semester
        })));
      });

      if (allSessions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No sessions found for this lecturer'
        });
      }

      res.json({
        success: true,
        lecturer: lecturerName,
        count: allSessions.length,
        data: allSessions
      });

    } catch (error) {
      console.error('Get sessions by lecturer error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving sessions by lecturer',
        error: error.message
      });
    }
  },

  /**
   * Get timetable metadata (for AI context)
   * GET /api/timetables/:id/metadata
   */
  getMetadata: async (req, res) => {
    try {
      const timetable = await Timetable.findById(req.params.id);

      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found'
        });
      }

      res.json({
        success: true,
        data: {
          school: timetable.school,
          schoolName: timetable.schoolName,
          academicYear: timetable.academicYear,
          semester: timetable.semester,
          metadata: timetable.metadata,
          uploadDate: timetable.uploadDate,
          version: timetable.version
        }
      });

    } catch (error) {
      console.error('Get metadata error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving metadata',
        error: error.message
      });
    }
  },

  /**
   * Delete timetable
   * DELETE /api/timetables/:id
   */
  deleteTimetable: async (req, res) => {
    try {
      const timetable = await Timetable.findByIdAndDelete(req.params.id);

      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found'
        });
      }

      res.json({
        success: true,
        message: 'Timetable deleted successfully'
      });

    } catch (error) {
      console.error('Delete timetable error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting timetable',
        error: error.message
      });
    }
  },

  /**
   * Get available periods
   * GET /api/timetables/periods
   */
  getAvailablePeriods: async (req, res) => {
    try {
      const periods = await Timetable.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: {
              school: '$school',
              academicYear: '$academicYear',
              semester: '$semester'
            },
            schoolName: { $first: '$schoolName' },
            uploadDate: { $first: '$uploadDate' },
            totalSessions: { $first: '$metadata.totalSessions' }
          }
        },
        {
          $project: {
            _id: 0,
            school: '$_id.school',
            schoolName: 1,
            academicYear: '$_id.academicYear',
            semester: '$_id.semester',
            uploadDate: 1,
            totalSessions: 1
          }
        },
        { $sort: { academicYear: -1, semester: -1 } }
      ]);

      res.json({
        success: true,
        count: periods.length,
        data: periods
      });

    } catch (error) {
      console.error('Get periods error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving available periods',
        error: error.message
      });
    }
  }
};

module.exports = timetableController;