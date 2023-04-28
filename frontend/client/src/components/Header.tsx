import * as React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import logo from '../assets/salt.png'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { NavLink } from 'react-router-dom';

function Login() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [auth, setAuth] = React.useState(false);

  const signout = () => {
    setAnchorEl(null);
    setAuth(false);
  };

  return (
    <Box sx={{m: 'auto',}}>
      {!auth && (
        <Stack spacing={0} direction="row">
          <Button color='inherit' onClick={() => {
              setAuth(true)
            }} >
            <Typography >
              ログイン
            </Typography>
          </Button>
          <Button color='inherit' href="/signup" >
            <Typography >
            新規登録
            </Typography>
            {/* 新規登録 */}
          </Button>
        </Stack>
      )}
      {auth && (
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={signout}>ログアウト</MenuItem>
          </Menu>
        </div>
      )}
    </Box>
  )
}

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        borderBottom: 1,
        borderColor: 'grey.500',
        backgroundColor: (theme) => theme.palette.common.white
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box 
            sx={{
              my: 1,
              display: 'flex', 
              flexGrow: 1,
              alignItems: 'center'
            }}
          >
            <img src={logo} alt="logo" width='40' height='40'/>
            <Typography variant="h5" >
              Portfolio
            </Typography>
          </Box>
          <Box
            sx={{
              justifyContent: 'flex-end',
              display: 'flex', 
              alignItems: 'center'
            }}
          >
            <Login/>
            <Box sx={{ml:1}}>
              <Button
                variant='contained'
                href="/contact"
                disableRipple
              >
              問い合わせ
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          <NavLink end to="/" >
            {({ isActive }) => (
              <Button
                href="/"
                disableRipple
                sx={{
                  color: 'black',
                  borderRadius: 0,
                  borderBottom: 2,
                  borderColor: isActive ? 'secondary.main': 'white',
                }}
              >
              ホーム
              </Button>
            )}
          </NavLink>
          <NavLink end to="/events" >
            {({ isActive }) => (
              <Button
                href="/events"
                disableRipple
                sx={{
                  color: 'black',
                  borderRadius: 0,
                  borderBottom: 2,
                  borderColor: isActive ? 'secondary.main': 'white',
                }}
              >
              イベント
              </Button>
            )}
          </NavLink>
        </Box>
      </Container>
    </Box>
  );
}