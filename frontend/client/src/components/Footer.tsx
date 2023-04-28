import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import Qiita from '../assets/qiita.png'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'grey.500',
        backgroundColor: (theme) => theme.palette.grey[300]
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'center',
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            ©salt0000
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'cnter',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            <Box sx={{mr:1}}>
              <GitHubIcon color="primary"/>
            </Box>
            <Box sx={{mt:0.1}}>
              <img src={Qiita} alt="logo" width="22.5" height="22.5"/>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}