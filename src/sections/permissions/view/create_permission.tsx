import { useState } from "react";
import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCreatePermissionMutation } from "../../../../redux/service/permissionSlice";

export default function PermissionCreateView() {
  const [createPermission, { isLoading }] =
    useCreatePermissionMutation();

  const [form, setForm] = useState({
    name: "",
  });

  const [errors, setErrors] = useState<any>({});

  // -----------------------------
  // Handle Change
  // -----------------------------
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

  // -----------------------------
  // Validation
  // -----------------------------
  const validate = () => {
    let temp: any = {};

    if (!form.name.trim()) {
      temp.name = "Permission name is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createPermission(form).unwrap();

      toast.success("Permission created successfully");

      setForm({
        name: "",
      });

      setErrors({});
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to create permission"
      );
    }
  };

  return (
    <DashboardContent>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Create Permission
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            name="name"
            label="Permission Name"
            placeholder="Example: user.view"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={
              errors.name ||
              "Example: user.view, role.create, company.edit"
            }
          />

          <Button
            variant="contained"
            color="inherit"
            size="large"
            fullWidth
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading
              ? "Saving..."
              : "Create Permission"}
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