import { useState, useEffect } from 'react';
import { Box, Card, Stack, TextField, Button, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import { DashboardContent } from 'src/layouts/dashboard';
import { 
  useUpdateEmployeeMutation,
  useGetSingleEmployeeQuery 
} from '../../../../redux/service/employeeSlice';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function EmployeeUpdateView() {

  // 1️⃣ Get ID first (fixes your error)
  const { id } = useParams();

  // 2️⃣ Fetch employee data
  const { data, isLoading: isFetching } = useGetSingleEmployeeQuery(id || "");

  // 3️⃣ Update mutation
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  // 4️⃣ Form State
  const [form, setForm] = useState({
    name: '',
    employee_id: '',
    phone: '',
    company_id: '',
    nature_of_employment: '',
    department: '',
    unit: '',
    date_of_joining: '',
    division: '',
    designation: '',
    reporting_person: '',
    email: '',
    dob: '',
    section_info: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<any>({});

  // 5️⃣ Prefill form when API returns data
  useEffect(() => {
    if (data) {
      setForm({ ...data });
    }
  }, [data]);


  // -------------------------
  // HANDLE INPUT CHANGE
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };


  // -------------------------
  // VALIDATION
  // -------------------------
  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.nature_of_employment.trim()) newErrors.nature_of_employment = "This field is required";
    if (!form.date_of_joining) newErrors.date_of_joining = "Joining date required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // -------------------------
  // SUBMIT FORM
  // -------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await updateEmployee({ id, data: formData }).unwrap();
      toast.success("Employee updated successfully!");
    } catch (err: any) {
      if (err?.data) {
        setErrors(err.data);
      } else {
        toast.error("Failed to update employee");
      }
    }
  };


  if (isFetching) return <p>Loading...</p>;


  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Employee
      </Typography>

      <Card sx={{ p: 3, maxWidth: 700 }}>
        <Stack spacing={2}>

          <TextField
            name="name"
            label="Employee Name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            name="employee_id"
            label="Employee ID"
            value={form.employee_id}
            onChange={handleChange}
            error={!!errors.employee_id}
            helperText={errors.employee_id}
          />

          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <TextField
            name="company_id"
            label="Company ID"
            value={form.company_id}
            onChange={handleChange}
          />

          <TextField
            name="nature_of_employment"
            label="Nature of Employment"
            value={form.nature_of_employment}
            onChange={handleChange}
            error={!!errors.nature_of_employment}
            helperText={errors.nature_of_employment}
          />

          <TextField name="department" label="Department" value={form.department} onChange={handleChange} />
          <TextField name="unit" label="Unit" value={form.unit} onChange={handleChange} />

          <TextField
            name="date_of_joining"
            label="Date of Joining"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date_of_joining}
            onChange={handleChange}
            error={!!errors.date_of_joining}
            helperText={errors.date_of_joining}
          />

          <TextField name="division" label="Division" value={form.division} onChange={handleChange} />
          <TextField name="designation" label="Designation" value={form.designation} onChange={handleChange} />
          <TextField name="reporting_person" label="Reporting Person" value={form.reporting_person} onChange={handleChange} />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} />

          <TextField
            name="dob"
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.dob}
            onChange={handleChange}
          />

          <TextField name="section_info" label="Section Info" value={form.section_info} onChange={handleChange} />

          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Employee"}
          </Button>

        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
