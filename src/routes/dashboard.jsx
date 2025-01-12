import { useState, useEffect } from 'react';
import { fetcher } from '../api';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Alert,
  Checkbox,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    completion: false
  });
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUsername();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetcher({
        url: userId ? `/tasks/user/${userId}` : '/tasks',
        method: 'GET'
      });
      if (response?.data) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await fetcher({
        url: `/user/${userId}`,
        method: 'GET'
      });
      if (response?.data) {
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetcher({
        url: userId ? `/tasks/user/${userId}` : '/tasks',
        method: 'POST',
        params: {
            title: newTask.title,
            description: newTask.description,
            completion: newTask.completion ? 'on' : undefined
        }
      });
      
      if (response) {
        setNewTask({ title: '', description: '', completion: false });
        fetchTasks();
      }
    } catch (error) {
      setError('Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus, task) => {
    setError('');
    try {
      const response = await fetcher({
        url: `/tasks/update?taskId=${taskId}`,
        method: 'POST',
        params: {
          title: task.title,
          description: task.description,
          completed: currentStatus ? 'on' : undefined,
        },
      });
      
      if (response) {
        fetchTasks();
      }
    } catch (error) {
      setError('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/tasks/${taskId}/edit/${userId ? `${userId}` : ''}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Task List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              {userId ? `${username}'s Tasks` : 'Tasks'}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditTask(task.id)}
                      >
                        Edit
                      </Button>
                      <Checkbox
                        edge="end"
                        checked={Boolean(task.completed)}
                        onChange={(event) => handleToggleComplete(task.id, event.target.checked, task)}
                      />
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={task.title}
                    secondary={task.description}
                  />
                </ListItem>
              ))}
              {tasks.length === 0 && (
                <ListItem>
                  <ListItemText primary="No tasks found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* New Task Form */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              position: 'fixed',
              width: '30%',
              right: '24px'
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Create New Task
            </Typography>
            <Box component="form" onSubmit={handleCreateTask}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Task Title"
                name="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={newTask.completion}
                  onChange={(e) => setNewTask({ ...newTask, completion: e.target.checked })}
                  id="completion"
                  name="completion"
                />
                <Typography>Mark as completed</Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Task
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
