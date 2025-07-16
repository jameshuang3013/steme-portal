import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courseRoutes.js';

import assignmentsRoutes from './routes/assignmentsRoutes.js';
import usersRoute from './routes/users.js';
import outlinesRoute from './routes/outlines.js';
import attendanceRoutes from './routes/attendance.js'
import gradesRoutes from './routes/grades.js'
import submissionRoutes from './routes/submissions.js'


dotenv.config();
const app = express();
const PORT = 4000;

const corsOptions = {
  origin: 'http://localhost:3000', // your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // allow cookies / headers
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use("/api/users", usersRoute);
app.use("/api/outlines", outlinesRoute);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/submissions", submissionRoutes);


app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});