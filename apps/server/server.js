require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const { authRoutes} = require('./models/auth');

const faqRoutes = require('./routes/faqRoutes');
const chatbot = require('./routes/chatbot');
const researchRoutes = require('./routes/research');
const timetableRoutes = require('./routes/timetableRoutes');
const scholarshipRoutes = require('./routes/scholarship')
const app = express();


app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chatbot', chatbot);
app.use('/api/research', researchRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/scholarships', scholarshipRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
