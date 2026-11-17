import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export interface ReportExportButtonsProps {
  onExcel?: () => void;
  onPdf?: () => void;
  disabled?: boolean;
}

export function ReportExportButtons({
  onExcel,
  onPdf,
  disabled = false,
}: ReportExportButtonsProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small" disabled={disabled} onClick={onExcel}>
        Excel
      </Button>
      <Button variant="outlined" size="small" disabled={disabled} onClick={onPdf}>
        PDF
      </Button>
    </Stack>
  );
}
