// import { useState } from 'react';
// import { 
//   Box, Card, Stack, TextField, Button, Typography, Avatar 
// } from '@mui/material';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { useCreateCompanyMutation } from '../../../../redux/service/companySlice';

// export default function CompanyCreateView() {
//   const [createCompany, { isLoading }] = useCreateCompanyMutation();

//   const [form, setForm] = useState({
//     company_name: '',
//     email: '',
//     phone: '',
//     address: '',
//     avatar: null as File | null,
//   });

//   const [errors, setErrors] = useState<any>({});
//   const [preview, setPreview] = useState<string | null>(null);

//   // -----------------------
//   // IMAGE SELECT + PREVIEW
//   // -----------------------
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setForm((prev) => ({ ...prev, avatar: file }));
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // -----------------------
//   // FORM INPUT CHANGE
//   // -----------------------
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' });
//   };

//   // -----------------------
//   // VALIDATION
//   // -----------------------
//   const validate = () => {
//     const newErrors: any = {};

//     if (!form.company_name.trim()) newErrors.name = 'Company name is required';
//     if (!form.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';

//     if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
//     else if (!/^\d{10,15}$/.test(form.phone))
//       newErrors.phone = 'Phone must be 10–15 digits';

//     if (!form.address.trim()) newErrors.address = 'Address is required';
//     if (!form.avatar) newErrors.avatar = 'Avatar image is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // -----------------------
//   // SUBMIT
//   // -----------------------
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     const formData = new FormData();
//     formData.append('company_name', form.company_name);
//     formData.append('email', form.email);
//     formData.append('phone', form.phone);
//     formData.append('address', form.address);
//     if (form.avatar) formData.append('avatar', form.avatar);

//     try {
//       await createCompany(formData).unwrap();
//       alert('Company created!');
//     } catch (error) {
//       alert('Failed to create company');
//     }
//   };

//   return (
//     <DashboardContent>
//       <Typography variant="h4" sx={{ mb: 3 }}>
//         Create New Company
//       </Typography>

//       <Card sx={{ p: 3, maxWidth: 600 }}>
//         <Stack spacing={2}>

//           {/* IMAGE UPLOAD + PREVIEW */}
//           <Stack spacing={1} alignItems="center">
//             <Avatar
//               src={preview || ''}
//               sx={{ width: 120, height: 120, border: '2px solid #ccc' }}
//             />

//             <Button variant="outlined" component="label">
//               Upload Avatar
//               <input hidden type="file" accept="image/*" onChange={handleImageChange} />
//             </Button>

//             {errors.avatar && (
//               <Typography color="error" variant="caption">
//                 {errors.avatar}
//               </Typography>
//             )}
//           </Stack>

//           <TextField
//             name="company_name"
//             label="Company Name"
//             error={!!errors.name}
//             helperText={errors.name}
//             onChange={handleChange}
//           />

//           <TextField
//             name="email"
//             label="Email"
//             error={!!errors.email}
//             helperText={errors.email}
//             onChange={handleChange}
//           />

//         <TextField
//         name="phone"
//         label="Phone"
//         value={form.phone}
//         onChange={(e) => {
//             const value = e.target.value.replace(/\D/g, ''); // remove non-numeric
//             if (value.length <= 11) {
//             setForm({ ...form, phone: value });
//             }
//         }}
//         inputProps={{ maxLength: 11 }}
//         error={!!errors.phone}
//         helperText={errors.phone}
//         />


//           <TextField
//             name="address"
//             label="Address"
//             error={!!errors.address}
//             helperText={errors.address}
//             onChange={handleChange}
//           />

//           <Button 
//             variant="contained"
//             fullWidth
//             size="large"
//             color="inherit"
//             onClick={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Creating...' : 'Create Company'}
//           </Button>
//         </Stack>
//       </Card>
//     </DashboardContent>
//   );
// }
import { useState } from 'react';
import { 
  Box, Card, Stack, TextField, Button, Typography, Avatar 
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateCompanyMutation } from '../../../../redux/service/companySlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyCreateView() {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const [form, setForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    avatar: null as File | null,
  });

  

  const [errors, setErrors] = useState<any>({});
  const [preview, setPreview] = useState<string | null>(null);

  // -----------------------
  // IMAGE SELECT + PREVIEW
  // -----------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev: any) => ({ ...prev, avatar: '' }));
    }
  };

  // -----------------------
  // FORM INPUT CHANGE
  // -----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // -----------------------
  // VALIDATION
  // -----------------------
  const validate = () => {
    const newErrors: any = {};

    if (!form.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';

    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(form.phone))
      newErrors.phone = 'Phone must be 10–15 digits';

    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.avatar) newErrors.avatar = 'Avatar image is required';

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
      await createCompany(formData).unwrap();
      toast.success('Company created successfully!');

      // Reset form
      setForm({
        company_name: '',
        email: '',
        phone: '',
        address: '',
        avatar: null,
      });
      setPreview(null);
      setErrors({});
    } catch (err: any) {
      if (err?.data) {
        // Assume backend returns validation errors in err.data
        setErrors(err.data);
      } else {
        toast.error('Failed to create company');
      }
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create New Company
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
              Upload Avatar
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>

            {errors.avatar && (
              <Typography color="error" variant="caption">
                {errors.avatar}
              </Typography>
            )}
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
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 15) {
                setForm({ ...form, phone: value });
                setErrors({ ...errors, phone: '' });
              }
            }}
            inputProps={{ maxLength: 15 }}
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
            {isLoading ? 'Creating...' : 'Create Company'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
