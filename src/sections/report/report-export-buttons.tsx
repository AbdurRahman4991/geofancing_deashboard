import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function ReportExportButtons() {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small">Excel</Button>
      <Button variant="outlined" size="small">PDF</Button>
    </Stack>
  );
}
