import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetcher } from '../api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Checkbox
} from '@mui/material';

export default function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    completion: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetcher({
        url: `/tasks/${taskId}`,
        method: 'GET'
      });
      if (response?.data) {
        setTask({
          title: response.data.title,
          description: response.data.description,
          completion: Boolean(response.data.completed)
        });
      }
    } catch (error) {
      setError('Failed to fetch task');
      console.error('Error fetching task:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetcher({
        url: `/tasks/update?taskId=${taskId}`,
        method: 'POST',
        params: {
          title: task.title,
          description: task.description,
          completed: task.completion ? 'on' : undefined
        }
      });
      
      if (response) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h5" color="primary" gutterBottom>
          Edit Task
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleUpdateTask}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Task Title"
            name="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Task Description"
            name="description"
            multiline
            rows={4}
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={task.completion}
              onChange={(e) => setTask({ ...task, completion: e.target.checked })}
              id="completion"
              name="completion"
            />
            <Typography>Mark as completed</Typography>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Update Task
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
