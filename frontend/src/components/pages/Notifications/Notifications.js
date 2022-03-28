import { Container, Paper, Box, Typography } from '@mui/material';

const Notifications = () => (
  <Container maxWidth="sm">
    <Paper>
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>No notifications</Typography>
      </Box>
    </Paper>
  </Container>
);

export default Notifications;
