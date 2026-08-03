
import { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { DashboardContent } from "src/layouts/dashboard";

import {
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
} from "../../../../redux/service/roleSlice";

import { toast } from "react-toastify";

export default function RoleEditView() {
  const { id } = useParams();

  const navigate = useNavigate();

const { data, isLoading } = useGetSingleRoleQuery(id!);

console.log(data);

  const [updateRole, { isLoading: updating }] =
    useUpdateRoleMutation();

  const [form, setForm] = useState({
    name: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
      });
    }
  }, [data]);

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
    let temp: any = {};

    if (!form.name.trim()) {
      temp.name = "Role name is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await updateRole({
        id,
        data: form,
      }).unwrap();

      toast.success("Role updated successfully");

      navigate("/roles");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Update failed"
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Edit Role
      </Typography>

      <Card
        sx={{
          p: 4,
          maxWidth: 650,
        }}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            name="name"
            label="Role Name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleSubmit}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Role"}
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/roles")}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}