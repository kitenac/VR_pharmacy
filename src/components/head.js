
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { VR } from '../Media';

import { Breadcrumbs,  
         Link,
         AppBar,
         Box,
         Toolbar,
         IconButton,
         Typography,
         Menu, 
         Avatar,
         Tooltip,
         MenuItem,
        } from "@mui/material"


const pages = [['Группы', '/groups'], ['Задания', '/quests']];
const settings = ['Профиль', 'Выйти'];

export const Head = () => {
  const redirect = useNavigate()  
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // red-theme: #db2235
  return ( <AppBar position="sticky" sx={{background: 'linear-gradient(0deg, rgba(0,25,89,0.9177871832326681) 42%, rgba(0,15,67,1) 97%)'}}>
      <Box>
        <Toolbar>
        <img src={VR} width={'50px'} height={'50px'} style={{marginRight: '2rem', cursor: 'pointer', flexGrow: 0}}
             onClick={()=>redirect('/')} />
        
          <Typography
            variant="title"
            noWrap
            component="a"
            onClick={()=>redirect('/')}
            sx={{
              pl: '2rem',
              pr: '4rem',
              cursor: 'pointer',
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
           VR for students
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex', } }}>
              {pages.map(([page, link]) => (
                <MenuItem key={page} >
                  <Link onClick={() => redirect(link)} color='inherit' underline='none'>
                    <Typography textAlign="center" variant='content'> {page}</Typography>
                  </Link>
                </MenuItem>
              ))}
          </Box>


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Teacher" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}


