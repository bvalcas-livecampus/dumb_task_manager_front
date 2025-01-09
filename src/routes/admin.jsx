import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetcher } from '../api/index';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetcher({
        url: '/admin/users',
        method: 'GET'
      });
      if (response?.data) {
        const sortedUsers = response.data.users.sort((a, b) => {
          const rolePriority = {
            'superAdmin': 1,
            'admin': 2,
            'user': 3
          };
          
          const roleComparison = (rolePriority[a.role] || 999) - (rolePriority[b.role] || 999);
          
          if (roleComparison === 0) {
            return a.username.localeCompare(b.username);
          }
          
          return roleComparison;
        });
        
        setUsers(sortedUsers);
        setCurrentUserId(response.data.userId);
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetcher({
        url: `/admin/delete-user`,
        method: 'POST',
        params: { idToDelete: userToDelete.id }
      });
      
      if (response) {
        fetchUsers(); // Refresh the list after deletion
        closeDeleteDialog();
      }
    } catch (error) {
      setError('Failed to delete user');
      console.error('Error deleting user:', error);
      closeDeleteDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          User Management
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <List>
          {users.length > 0 && users.map((user) => {
            if (user.id === currentUserId) {
              return (
                <ListItem
                  key={user.id}
                  divider
                  sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5' }}
                >
                  <ListItemText
                    primary={`${user.username} (You)`}
                    secondary={`Role: ${user.role || 'Inconnu'}`}
                  />
                </ListItem>
              );
            }
            return null;
          })}
          {users.map((user) => {
            if (user.id !== currentUserId) {
              return (
                <ListItem
                  key={user.id}
                  divider
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => openDeleteDialog(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={user.username}
                    secondary={`Role: ${user.role || 'Inconnu'}`}
                  />
                </ListItem>
              );
            }
            return null;
          })}
          {users.length === 0 && (
            <ListItem>
              <ListItemText primary="No users found" />
            </ListItem>
          )}
        </List>

        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete User
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete user "{userToDelete?.username}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteUser} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
