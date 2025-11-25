import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { 
  Box, Card, Stack, TextField, Button, Typography, Avatar 
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateCompanyMutation, useGetSingleCompanyQuery } from '../../../../redux/service/companySlice';
import { toast, ToastContainer } from 'react-toastify';

export default function CompanyUpdateView() {
  const { id } = useParams();  // <-- get URL ID

  const { data, isLoading: isFetching } = useGetSingleCompanyQuery(id);
  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

  const [form, setForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<any>({});
  const [preview, setPreview] = useState<string | null>(null);

  // ================================
  // 🔥  Load existing company values
  // ================================
useEffect(() => {
  if (data) {
    setForm({
      company_name: data.company_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      avatar: null,
    });

    setPreview(data.avatar_url || data.avatar || null); 
  }
}, [data]);


  // -----------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev: any) => ({ ...prev, avatar: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // SUBMIT
  // -----------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append('company_name', form.company_name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('address', form.address);

    if (form.avatar) formData.append('avatar', form.avatar);

    try {
      await updateCompany({ id, data: formData }).unwrap();
      toast.success('Company updated successfully!');
    } catch (err: any) {
      toast.error("Failed to update");
    }
  };

  if (isFetching) return <Typography sx={{ p: 3 }}>Loading company...</Typography>;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Company
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>

          {/* IMAGE UPLOAD + PREVIEW */}
          <Stack spacing={1} alignItems="center">
            <Avatar
              src={preview || ''}
              sx={{ width: 120, height: 120, border: '2px solid #ccc' }}
            />

            <Button variant="outlined" component="label">
              Change Avatar
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>
          </Stack>

          <TextField
            name="company_name"
            label="Company Name"
            value={form.company_name}
            error={!!errors.company_name}
            helperText={errors.company_name}
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Email"
            value={form.email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={handleChange}
          />

          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <TextField
            name="address"
            label="Address"
            value={form.address}
            error={!!errors.address}
            helperText={errors.address}
            onChange={handleChange}
          />

          <Button 
            variant="contained"
            fullWidth
            size="large"
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Company'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
