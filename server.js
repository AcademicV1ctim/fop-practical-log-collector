import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRoutes from './routes/mainRoutes.js';
import { verifyToken } from './middleware/jwtMiddleware.js';
import cors from 'cors';
import './schedulers/scoreScheduler.js';


const app = express();
// Add middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use cors
app.use(cors({
  origin: 'https://st0523-fop-practicals-master.onrender.com/',
  credentials: true
}));

//giving the path and directory to show the user
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// all files from the Frontend folder
// app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Public routes for login and signup (no authentication required)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});


app.get('/dashboard',(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Dashboard.html'));
});

app.get('/class-score', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ClassScore.html'));
});

app.get('/fastest-solve', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'FastestSolve.html'));
});

app.get('/least-attempts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'LeastAttempts.html'));
});

app.get('/profile',(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Profile.html'));
});

app.get('/individual-progress',(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'IndividualProgress.html'));
});

app.get('/weekly-chart',(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'weeklychart.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.get('/userData', verifyToken, (req, res) => {
  res.json({ 
    userId: res.locals.userId,
    tokenTimestamp: res.locals.tokenTimestamp
   });
});

app.use('/', mainRoutes);

// 404 handler - redirect to login
app.use((req, res) => {
  res.redirect('/login');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});