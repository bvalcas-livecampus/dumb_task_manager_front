import { AppBar, Box, Button, Toolbar, Typography, IconButton } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import PropTypes from 'prop-types';

const Header = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Task Manager
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            sx={{ mr: 1 }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {user && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired
};

export default Header;
