import { Button, Stack, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';

export default function UpdateTourPlanView() {
  const router = useRouter();
  return (
    <DashboardContent>
      <Stack spacing={2}>
        <Typography variant="h4">Tour plan editing is not available</Typography>
        <Typography color="text.secondary">The supplied API currently supports listing and creating tour plans.</Typography>
        <Button variant="contained" onClick={() => router.push('/tour-plan')} sx={{ alignSelf: 'flex-start' }}>Back to tour plans</Button>
      </Stack>
    </DashboardContent>
  );
}
