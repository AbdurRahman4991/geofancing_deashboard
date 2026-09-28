import { useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Autocomplete,
  FormControlLabel,
  Switch,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ============================================================
// ATTENDANCE API
// ============================================================

import {
  useCreateAttendanceRoleMutation,
} from '../../../../redux/service/attendanceRoleSlice';

// ============================================================
// COMPANY API
// ============================================================

import {
  useGetCompanyQuery,
} from '../../../../redux/service/companySlice';

// ----------------------------------------------------------------------

export default function AttendanceRoleCreateView() {
  // ============================================================
  // CREATE ATTENDANCE ROLE
  // ============================================================

  const [
    createAttendanceRule,
    { isLoading },
  ] = useCreateAttendanceRoleMutation();

  // ============================================================
  // COMPANY API
  // ============================================================

  const {
    data: companyData,
    isLoading: companyLoading,
  } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });

  const companies =
    companyData?.data ?? [];

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState({
    company_id: '',
    office_in_time: '',
    office_out_time: '',
    weekend_holidays: '',
    government_holidays: '',
    is_active: true,
  });

  // ============================================================
  // ERRORS
  // ============================================================

  const [errors, setErrors] =
    useState<any>({});

  // ============================================================
  // SELECTED COMPANY
  // ============================================================

  const selectedCompany =
    companies.find(
      (company) =>
        String(company.id) ===
        form.company_id
    ) ?? null;

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // ============================================================
  // HANDLE COMPANY
  // ============================================================

  const handleCompanyChange = (
    _event: any,
    company: any
  ) => {
    setForm({
      ...form,
      company_id: company
        ? String(company.id)
        : '',
    });

    setErrors({
      ...errors,
      company_id: '',
    });
  };

  // ============================================================
  // HANDLE STATUS
  // ============================================================

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      is_active:
        e.target.checked,
    });
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const newErrors: any = {};

    if (!form.company_id) {
      newErrors.company_id =
        'Company is required';
    }

    if (!form.office_in_time) {
      newErrors.office_in_time =
        'Office in time is required';
    }

    if (!form.office_out_time) {
      newErrors.office_out_time =
        'Office out time is required';
    }

    if (
      !form.weekend_holidays.trim()
    ) {
      newErrors.weekend_holidays =
        'Weekend holidays are required';
    }

    if (
      !form.government_holidays.trim()
    ) {
      newErrors.government_holidays =
        'Government holidays are required';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append(
      'company_id',
      form.company_id
    );

    formData.append(
      'office_in_time',
      form.office_in_time
    );

    formData.append(
      'office_out_time',
      form.office_out_time
    );

    formData.append(
      'weekend_holidays',
      form.weekend_holidays
    );

    formData.append(
      'government_holidays',
      form.government_holidays
    );

    formData.append(
      'is_active',
      form.is_active
        ? '1'
        : '0'
    );

    try {
      await createAttendanceRule(
        formData
      ).unwrap();

      toast.success(
        'Attendance role created successfully!'
      );

      // Reset
      setForm({
        company_id: '',
        office_in_time: '',
        office_out_time: '',
        weekend_holidays: '',
        government_holidays: '',
        is_active: true,
      });

      setErrors({});
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(
          err.data.errors
        );
      } else {
        toast.error(
          'Failed to create attendance role'
        );
      }
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardContent>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Create Attendance Role
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 700,
        }}
      >
        <Stack spacing={2}>

          {/* ==================================================
              COMPANY SEARCH DROPDOWN
          ================================================== */}

          <Autocomplete
            options={companies}
            value={selectedCompany}
            loading={companyLoading}
            onChange={
              handleCompanyChange
            }
            getOptionLabel={(
              option
            ) =>
              option.company_name ??
              ''
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              option.id ===
              value.id
            }
            noOptionsText="No company found"
            loadingText="Loading companies..."
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company"
                placeholder="Search company..."
                error={
                  !!errors.company_id
                }
                helperText={
                  errors.company_id
                }
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: 300,
                overflow: 'auto',
              },
            }}
          />

          {/* ==================================================
              OFFICE IN TIME
          ================================================== */}

          <TextField
            name="office_in_time"
            label="Office In Time"
            type="time"
            value={
              form.office_in_time
            }
            onChange={handleChange}
            error={
              !!errors.office_in_time
            }
            helperText={
              errors.office_in_time
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          {/* ==================================================
              OFFICE OUT TIME
          ================================================== */}

          <TextField
            name="office_out_time"
            label="Office Out Time"
            type="time"
            value={
              form.office_out_time
            }
            onChange={handleChange}
            error={
              !!errors.office_out_time
            }
            helperText={
              errors.office_out_time
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          {/* ==================================================
              WEEKEND HOLIDAYS
          ================================================== */}

          <TextField
            name="weekend_holidays"
            label="Weekend Holidays"
            placeholder="Friday, Saturday"
            value={
              form.weekend_holidays
            }
            onChange={handleChange}
            error={
              !!errors.weekend_holidays
            }
            helperText={
              errors.weekend_holidays ||
              'Example: Friday, Saturday'
            }
            fullWidth
          />

          {/* ==================================================
              GOVERNMENT HOLIDAYS
          ================================================== */}

          <TextField
            name="government_holidays"
            label="Government Holidays"
            placeholder="Eid-ul-Fitr, Eid-ul-Adha"
            value={
              form.government_holidays
            }
            onChange={handleChange}
            error={
              !!errors.government_holidays
            }
            helperText={
              errors.government_holidays ||
              'Example: Eid-ul-Fitr, Eid-ul-Adha'
            }
            fullWidth
          />

          {/* ==================================================
              ACTIVE
          ================================================== */}

          <FormControlLabel
            control={
              <Switch
                checked={
                  form.is_active
                }
                onChange={
                  handleStatusChange
                }
              />
            }
            label={
              form.is_active
                ? 'Active'
                : 'Inactive'
            }
          />

          {/* ==================================================
              SUBMIT
          ================================================== */}

          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? 'Creating...'
              : 'Create Attendance Role'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </DashboardContent>
  );
}
