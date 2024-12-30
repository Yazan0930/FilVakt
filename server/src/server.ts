import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './router/userRoutes';
import fileRoutes from './router/fileRoutes';
import taskRoutes from './router/taskRoutes';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(bodyParser.json());

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes); 
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});