import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardContent } from "src/layouts/dashboard";

import {
  useGetSinglePermissionQuery,
  useUpdatePermissionMutation,
} from "../../../../redux/service/permissionSlice";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormState = {
  name: string;
  guard_name: string;
};

export default function PermissionUpdateView() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetching,
  } = useGetSinglePermissionQuery(id!, {
    skip: !id,
  });

  const permission = data?.data;

  const [updatePermission, { isLoading }] =
    useUpdatePermissionMutation();

  const [form, setForm] = useState<FormState>({
    name: "",
    guard_name: "web",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (permission) {
      setForm({
        name: permission.name,
        guard_name: permission.guard_name,
      });
    }
  }, [permission]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const temp: any = {};

    if (!form.name.trim()) {
      temp.name = "Permission name is required";
    }

    if (!form.guard_name.trim()) {
      temp.guard_name = "Guard name is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await updatePermission({
        id,
        data: form,
      }).unwrap();

      toast.success("Permission updated successfully");

      navigate("/permissions");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Update failed"
      );
    }
  };

  if (isFetching) {
    return (
      <DashboardContent>
        <Typography>Loading...</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Permission
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Permission Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Guard Name"
            name="guard_name"
            value={form.guard_name}
            onChange={handleChange}
            error={!!errors.guard_name}
            helperText={errors.guard_name}
            fullWidth
          />

          <Button
            variant="contained"
            color="inherit"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Updating..."
              : "Update Permission"}
          </Button>
        </Stack>
      </Card>

      <ToastContainer />
    </DashboardContent>
  );
}