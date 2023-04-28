import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {

  const navigate = useNavigate();

  const [registerInput, setRegister] = React.useState({
      name: '',
      email: '',
      password: '',
      error_list: [],
  });

  const baseURL = "http://localhost:8080";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      
    });
    data.append("name", "kunisawa")

    axios.get(baseURL + '/sanctum/csrf-cookie').then(response => {
      axios.post(baseURL + `/register`, data).then(res => {
          console.log(res);
          if(res.status === 204){
              localStorage.setItem('auth_token', res.data.token);
              localStorage.setItem('auth_name', res.data.username);
              console.log("Success", res.data.message, "success");
              navigate('/');
          } else {
              setRegister({...registerInput, error_list: res.data.validation_errors});
          }
      });
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          会員登録
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="メールアドレス"
                name="email"
                required
                fullWidth
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                label="パスワード"
                name="password"
                type="password"
                required
                fullWidth
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            次へ
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="signin" variant="body2">
                アカウントを持っている方はこちら
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}