import { useEffect, useState } from 'react';

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
import { useParams, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../../redux/service/companySlice';
import {
  useGetCountryHiearchyLevelQuery,
  useUpdateCountryHiearchyLevelMutation,
} from '../../../../../../redux/service/countryHiearchyLevelService';

type LevelForm = {
  company_id: string;
  name: string;
  code: string;
  level_order: string;
  is_active: boolean;
};

export default function UpdateLevelView() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const levelId = Number(id);
  const currentCompanyId = getCurrentCompanyId();
  const routeCompanyId = Number(searchParams.get('company_id'));
  const companyId = currentCompanyId || (Number.isInteger(routeCompanyId) && routeCompanyId > 0 ? routeCompanyId : 0);
  const {
    data: level,
    isLoading: isFetchingLevel,
    isError: isLevelError,
  } = useGetCountryHiearchyLevelQuery(
    { id: levelId, company_id: companyId },
    { skip: !id || !Number.isFinite(levelId) || !companyId }
  );
  const { data: companyData, isLoading: isCompaniesLoading } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });
  const companies = companyData?.data ?? [];
  const [updateLevel, { isLoading: isUpdating }] = useUpdateCountryHiearchyLevelMutation();

  const [form, setForm] = useState<LevelForm>({
    company_id: '',
    name: '',
    code: '',
    level_order: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LevelForm, string>>>({});

  useEffect(() => {
    if (level) {
      setForm({
        company_id: String(level.company_id),
        name: level.name ?? '',
        code: level.code ?? '',
        level_order: String(level.level_order ?? ''),
        is_active: level.is_active,
      });
    }
  }, [level]);

  const handleSubmit = async () => {
    if (!level) return;
    const nextErrors: Partial<Record<keyof LevelForm, string>> = {};
    const levelOrder = Number(form.level_order);

    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Level name is required';
    if (!form.level_order || !Number.isInteger(levelOrder) || levelOrder < 1) {
      nextErrors.level_order = 'Enter a valid level order';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!id || !Number.isFinite(levelId)) {
      toast.error('Level ID is missing or invalid');
      return;
    }

    try {
      await updateLevel({
        company_id: level.company_id,
        id: levelId,
        data: {
          name: form.name.trim(),
          code: form.code.trim() || null,
          level_order: levelOrder,
          is_active: form.is_active,
        },
      }).unwrap();

      toast.success('Country Level updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update level');
    }
  };

  if (isFetchingLevel || isCompaniesLoading) {
    return <DashboardContent><Typography>Loading contry level...</Typography></DashboardContent>;
  }

  if (isLevelError || !level) {
    return <DashboardContent><Typography color="error">Failed to load contry level.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update country Level</Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            select
            required
            name="company_id"
            label="Company"
            value={form.company_id}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, company_id: event.target.value }));
              setErrors((previous) => ({ ...previous, company_id: '' }));
            }}
            error={!!errors.company_id}
            helperText={errors.company_id}
            disabled
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
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Country Level'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}


