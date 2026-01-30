require('dotenv').config();
const mongoose = require('mongoose');
const School = require('../models/School');
const Programme = require('../models/Programme');

/* ============================
   Connect to Database
============================ */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

/* ============================
   Sample Data
============================ */
const schools = [
  {
    name: 'School of Business and Economics',
    code: 'SBE',
    description: 'Leading business education institution',
    dean: {
      name: 'Dr. Jane Kamau',
      email: 'jane.kamau@zetech.ac.ke',
      phone: '+254-700-123456'
    },
    contact: {
      email: 'business@zetech.ac.ke',
      phone: '+254-700-111222',
      office: 'Block A, 3rd Floor'
    }
  },
  {
    name: 'School of Information Technology',
    code: 'SIT',
    description: 'Cutting-edge technology education',
    dean: {
      name: 'Dr. Peter Omondi',
      email: 'peter.omondi@zetech.ac.ke',
      phone: '+254-700-234567'
    },
    contact: {
      email: 'it@zetech.ac.ke',
      phone: '+254-700-222333',
      office: 'Block B, 2nd Floor'
    }
  }
];

/* ============================
   Seed Function
============================ */
async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await School.deleteMany({});
    await Programme.deleteMany({});

    // Insert schools
    console.log('Inserting schools...');
    const createdSchools = await School.insertMany(schools);
    console.log(`Created ${createdSchools.length} schools`);

    // Create sample programme for Business School
    const businessSchool = createdSchools.find(s => s.code === 'SBE');
    
    const businessProgramme = {
      name: 'Diploma in Business Management and Administration',
      code: 'DBM101',
      school: businessSchool._id,
      level: 'Diploma',
      duration: {
        years: 2,
        semesters: 4
      },
      description: 'The program is meant to meet the current need for managers with broad based training, who are at the same time specialists in a given area of business.',
      campuses: ['Nairobi City Campus', 'Ruiru Campus'],
      units: [
        {
          code: 'BUS101',
          name: 'Introduction to Business',
          credits: 3,
          semester: 1,
          isCore: true,
          description: 'Fundamental concepts of business'
        },
        {
          code: 'ACC101',
          name: 'Principles of Accounting',
          credits: 3,
          semester: 1,
          isCore: true,
          description: 'Basic accounting principles'
        },
        {
          code: 'MGT101',
          name: 'Principles of Management',
          credits: 3,
          semester: 2,
          isCore: true,
          prerequisites: ['BUS101'],
          description: 'Management fundamentals'
        },
        {
          code: 'MKT101',
          name: 'Marketing Principles',
          credits: 3,
          semester: 2,
          isCore: true,
          description: 'Introduction to marketing'
        },
        {
          code: 'FIN201',
          name: 'Business Finance',
          credits: 4,
          semester: 3,
          isCore: true,
          prerequisites: ['ACC101'],
          description: 'Financial management in business'
        },
        {
          code: 'HRM201',
          name: 'Human Resource Management',
          credits: 3,
          semester: 3,
          isCore: true,
          description: 'Managing human resources'
        },
        {
          code: 'ENT301',
          name: 'Entrepreneurship',
          credits: 4,
          semester: 4,
          isCore: true,
          description: 'Starting and managing businesses'
        },
        {
          code: 'STR301',
          name: 'Strategic Management',
          credits: 4,
          semester: 4,
          isCore: true,
          prerequisites: ['MGT101'],
          description: 'Strategic planning and execution'
        }
      ],
      feeStructure: [
        {
          semester: 1,
          tuitionFee: 45000,
          examFee: 5000,
          activityFee: 2000,
          otherFees: 3000,
          totalFee: 55000
        },
        {
          semester: 2,
          tuitionFee: 45000,
          examFee: 5000,
          activityFee: 2000,
          otherFees: 3000,
          totalFee: 55000
        },
        {
          semester: 3,
          tuitionFee: 50000,
          examFee: 5000,
          activityFee: 2000,
          otherFees: 3000,
          totalFee: 60000
        },
        {
          semester: 4,
          tuitionFee: 50000,
          examFee: 5000,
          activityFee: 2000,
          otherFees: 3000,
          totalFee: 60000
        }
      ],
      careerPaths: [
        {
          title: 'Business Analyst',
          description: 'Analyze business processes and recommend improvements',
          averageSalary: {
            min: 60000,
            max: 120000,
            currency: 'KES'
          },
          jobOutlook: 'Growing demand in various sectors',
          requiredSkills: ['Analytical thinking', 'Communication', 'Problem-solving']
        },
        {
          title: 'Business Development Manager',
          description: 'Drive business growth and expansion',
          averageSalary: {
            min: 80000,
            max: 150000,
            currency: 'KES'
          },
          jobOutlook: 'Excellent opportunities in SMEs and corporations',
          requiredSkills: ['Sales', 'Negotiation', 'Strategic planning']
        },
        {
          title: 'Office Manager',
          description: 'Oversee administrative operations',
          averageSalary: {
            min: 50000,
            max: 100000,
            currency: 'KES'
          },
          jobOutlook: 'Stable demand across industries',
          requiredSkills: ['Organization', 'Leadership', 'Communication']
        }
      ],
      entryRequirements: {
        minimumGrade: 'C-',
        specificSubjects: [
          { subject: 'English', minimumGrade: 'D-' },
          { subject: 'Kiswahili', minimumGrade: 'D-' },
          { subject: 'Mathematics', minimumGrade: 'D-' }
        ],
        otherRequirements: [
          'KCSE certificate',
          'PASS in Zetech University Certificate or equivalent'
        ]
      },
      intakeMonths: ['January', 'May', 'September'],
      studyMode: ['Full-time', 'Part-time', 'E-Learning'],
      accreditation: ['Commission for University Education (CUE)'],
      highlights: [
        'IT Integration in curriculum',
        'Practical skills focus',
        'Pathway to degree programs',
        'Flexible study modes',
        'Industry-relevant training'
      ],
      programGoal: 'To provide learners with a thorough understanding of the fundamental principles and practices involved in effectively managing and leading business organizations.'
    };

    console.log('Creating Business Management programme...');
    await Programme.create(businessProgramme);
    console.log('Programme created successfully');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nCreated:');
    console.log(`- ${createdSchools.length} schools`);
    console.log('- 1 programme');
    console.log('- 8 units');
    console.log('- 4 semester fee structures');
    console.log('- 3 career paths\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();