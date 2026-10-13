import { useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useCreateLevelMutation } from '../../../../../redux/service/levelSlice';

type LevelForm = {
  company_id: string;
  name: string;
  code: string;
  level_order: string;
  is_active: boolean;
};

export default function CreateLevelView() {
  const [createLevel, { isLoading: isCreating }] = useCreateLevelMutation();
  const { data: companyData, isLoading: isCompaniesLoading } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });
  const companies = companyData?.data ?? [];

  const [form, setForm] = useState<LevelForm>({
    company_id: '1',
    name: '',
    code: '',
    level_order: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LevelForm, string>>>({});

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof LevelForm, string>> = {};
    const levelOrder = Number(form.level_order);

    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Level name is required';
    if (!form.level_order || !Number.isInteger(levelOrder) || levelOrder < 1) {
      nextErrors.level_order = 'Enter a valid level order';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createLevel({
        company_id: Number(form.company_id),
        name: form.name.trim(),
        code: form.code.trim() || null,
        level_order: levelOrder,
        is_active: form.is_active,
      }).unwrap();

      toast.success('Level created successfully');
      setForm((previous) => ({
        ...previous,
        name: '',
        code: '',
        level_order: '',
        is_active: true,
      }));
      setErrors({});
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create level');
    }
  };

  return (
    <DashboardContent>
      {/* <Typography variant="h4" sx={{ mb: 3 }}>Create Level</Typography> */}

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            select
            required
            name="company_id"
            label="Company"
            value={form.company_id}
            onChange={(event) => setForm((previous) => ({ ...previous, company_id: event.target.value }))}
            error={!!errors.company_id}
            helperText={errors.company_id}
            disabled={isCompaniesLoading}
            fullWidth
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.company_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            name="name"
            label="Level Name"
            placeholder="Example: Region"
            value={form.name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, name: event.target.value }));
              setErrors((previous) => ({ ...previous, name: '' }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            name="code"
            label="Code"
            placeholder="Optional"
            value={form.code}
            onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))}
            fullWidth
          />

          <TextField
            required
            name="level_order"
            label="Level Order"
            type="number"
            inputProps={{ min: 1, step: 1 }}
            value={form.level_order}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, level_order: event.target.value }));
              setErrors((previous) => ({ ...previous, level_order: '' }));
            }}
            error={!!errors.level_order}
            helperText={errors.level_order}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.is_active}
                onChange={(event) => setForm((previous) => ({ ...previous, is_active: event.target.checked }))}
              />
            }
            label={form.is_active ? 'Active' : 'Inactive'}
          />

          <Button
            variant="contained"
            size="large"
            color="inherit"
            onClick={handleSubmit}
            disabled={isCreating || isCompaniesLoading}
          >
            {isCreating ? 'Saving...' : 'Create Level'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
