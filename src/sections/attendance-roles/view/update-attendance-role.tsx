import { useState, useEffect } from 'react';

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

import { useParams } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  useGetSingleAttendanceRoleQuery,
  useUpdateAttendanceRoleMutation,
} from '../../../../redux/service/attendanceRoleSlice';

import { useGetCompanyQuery } from '../../../../redux/service/companySlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type FormState = {
  company_id: string;
  office_in_time: string;
  office_out_time: string;
  weekend_holidays: string;
  government_holidays: string;
  is_active: boolean;
};

type FormErrors = Partial<
  Record<keyof FormState, string>
>;

// ----------------------------------------------------------------------

export default function AttendanceRoleUpdateView() {
  // ============================================================
  // GET ID
  // ============================================================

  const { id } = useParams<{ id: string }>();

  // ============================================================
  // GET SINGLE ATTENDANCE ROLE
  // ============================================================

  const {
    data: attendanceRule,
    isLoading: isFetching,
  } = useGetSingleAttendanceRoleQuery(id!, {
    skip: !id,
  });

  // ============================================================
  // UPDATE MUTATION
  // ============================================================

  const [
    updateAttendanceRule,
    { isLoading },
  ] = useUpdateAttendanceRoleMutation();

  // ============================================================
  // GET COMPANIES
  // ============================================================

  const {
    data: companyData,
    isLoading: companyLoading,
  } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });

  const companies = companyData?.data ?? [];

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState<FormState>({
    company_id: '',
    office_in_time: '',
    office_out_time: '',
    weekend_holidays: '',
    government_holidays: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ============================================================
  // SELECTED COMPANY
  // ============================================================

  const selectedCompany =
    companies.find(
      (company) =>
        String(company.id) === form.company_id
    ) ?? null;

  // ============================================================
  // PREFILL DATA
  // ============================================================

  useEffect(() => {
    if (!attendanceRule) return;

    console.log(
      'Attendance Rule:',
      attendanceRule
    );

    // ------------------------------------------
    // Convert holiday array/string to text
    // ------------------------------------------

    const parseHolidayValue = (
      value: unknown
    ): string => {
      if (Array.isArray(value)) {
        return value.join(', ');
      }

      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);

          if (Array.isArray(parsed)) {
            return parsed.join(', ');
          }
        } catch {
          // Not JSON, continue
        }

        // Handle old format:
        // ['Friday', 'Saturday']
        const cleaned = value
          .replace(/^\[|\]$/g, '')
          .replace(/'/g, '')
          .replace(/"/g, '');

        return cleaned;
      }

      return '';
    };

    setForm({
      company_id: attendanceRule.company_id
        ? String(attendanceRule.company_id)
        : '',

      office_in_time:
        attendanceRule.office_in_time
          ? attendanceRule.office_in_time.substring(
              0,
              5
            )
          : '',

      office_out_time:
        attendanceRule.office_out_time
          ? attendanceRule.office_out_time.substring(
              0,
              5
            )
          : '',

      weekend_holidays:
        parseHolidayValue(
          attendanceRule.weekend_holidays
        ),

      government_holidays:
        parseHolidayValue(
          attendanceRule.government_holidays
        ),

      is_active:
        Boolean(
          attendanceRule.is_active
        ),
    });
  }, [attendanceRule]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ============================================================
  // COMPANY CHANGE
  // ============================================================

  const handleCompanyChange = (
    _event: React.SyntheticEvent,
    company: any
  ) => {
    setForm((prev) => ({
      ...prev,
      company_id: company
        ? String(company.id)
        : '',
    }));

    setErrors((prev) => ({
      ...prev,
      company_id: '',
    }));
  };

  // ============================================================
  // STATUS
  // ============================================================

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const newErrors: FormErrors = {};

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
      Object.keys(newErrors).length === 0
    );
  };

  // ============================================================
  // CONVERT TEXT TO ARRAY
  // ============================================================

  const convertToArray = (
    value: string
  ): string[] => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!id) {
      toast.error(
        'Attendance role ID not found'
      );
      return;
    }

    // ========================================================
    // JSON PAYLOAD
    // ========================================================

    const payload = {
      company_id: Number(
        form.company_id
      ),

      office_in_time:
        form.office_in_time,

      office_out_time:
        form.office_out_time,

      weekend_holidays:
        convertToArray(
          form.weekend_holidays
        ),

      government_holidays:
        convertToArray(
          form.government_holidays
        ),

      is_active:
        form.is_active,
    };

    console.log(
      'Update Attendance Role Payload:',
      payload
    );

    try {
      await updateAttendanceRule({
        id,
        data: payload,
      }).unwrap();

      toast.success(
        'Attendance role updated successfully!'
      );
    } catch (error: any) {
      console.error(
        'Update attendance role error:',
        error
      );

      console.error(
        'Backend response:',
        error?.data
      );

      if (error?.data?.errors) {
        setErrors(
          error.data.errors
        );
      } else {
        toast.error(
          error?.data?.message ||
            'Failed to update attendance role'
        );
      }
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isFetching) {
    return (
      <DashboardContent>
        <Typography>
          Loading attendance role...
        </Typography>
      </DashboardContent>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardContent>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Update Attendance Role
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 700,
        }}
      >
        <Stack spacing={2}>

          {/* ==================================================
              COMPANY
          ================================================== */}

          <Autocomplete
            options={companies}
            value={selectedCompany}
            loading={companyLoading}
            onChange={handleCompanyChange}
            getOptionLabel={(option) =>
              option.company_name ?? ''
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              option.id === value.id
            }
            noOptionsText="No company found"
            loadingText="Loading companies..."
            ListboxProps={{
              style: {
                maxHeight: 300,
                overflow: 'auto',
              },
            }}
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
          />

          {/* ==================================================
              OFFICE IN TIME
          ================================================== */}

          <TextField
            label="Office In Time"
            name="office_in_time"
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
            label="Office Out Time"
            name="office_out_time"
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
            label="Weekend Holidays"
            name="weekend_holidays"
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
            label="Government Holidays"
            name="government_holidays"
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
              STATUS
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
              UPDATE
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
              ? 'Updating...'
              : 'Update Attendance Role'}
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
