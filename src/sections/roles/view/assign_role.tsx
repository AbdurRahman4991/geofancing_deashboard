import { useState } from "react";
import {
  Card,
  Stack,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { toast, ToastContainer } from "react-toastify";

import { useGetAssignRoleUsersQuery } from "../../../../redux/service/userSlice";
import {
  useGetRolesQuery,
  useAssignRoleMutation,
} from "../../../../redux/service/roleSlice";

export default function AssignRoleView() {
  const [userId, setUserId] = useState<number | "">("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // ===========================
  // User List
  // ===========================
  const { data: userData, isLoading: userLoading } =
    useGetAssignRoleUsersQuery({
      page: 1,
      per_page: 100,
      search: "",
    });

  // ===========================
  // Role List
  // ===========================
  const { data: roleData, isLoading: roleLoading } =
    useGetRolesQuery();

  // ===========================
  // Assign Mutation
  // ===========================
  const [assignRole, { isLoading }] =
    useAssignRoleMutation();

  const users = userData?.data?.data ?? [];
  const roles = roleData?.data ?? [];

  // ===========================
  // Submit
  // ===========================
  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Please select user");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("Please select role");
      return;
    }

    try {
      await assignRole({
        userId,
        roles: selectedRoles,
      }).unwrap();

      toast.success("Role assigned successfully");

      setUserId("");
      setSelectedRoles([]);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Role assign failed"
      );
    }
  };

  if (userLoading || roleLoading) {
    return (
      <DashboardContent>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Assign Role
      </Typography>

      <Card
        sx={{
          p: 4,
          maxWidth: 700,
        }}
      >
        <Stack spacing={3}>
          {/* User */}

          <FormControl fullWidth>
            <InputLabel>User</InputLabel>

            <Select
              value={userId}
              label="User"
              onChange={(e) =>
                setUserId(Number(e.target.value))
              }
            >
              {users.map((user: any) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                >
                  {user.employee?.name ?? "-"} (
                  {user.employee?.employee_id ??
                    user.employee_id}
                  )
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Roles */}

          <FormControl fullWidth>
            <InputLabel>Roles</InputLabel>

            <Select
              multiple
              value={selectedRoles}
              input={<OutlinedInput label="Roles" />}
              onChange={(e) =>
                setSelectedRoles(
                  e.target.value as number[]
                )
              }
              renderValue={(selected) =>
                roles
                  .filter((role: any) =>
                    selected.includes(role.id)
                  )
                  .map((role: any) => role.name)
                  .join(", ")
              }
            >
              {roles.map((role: any) => (
                <MenuItem
                  key={role.id}
                  value={role.id}
                >
                  <Checkbox
                    checked={selectedRoles.includes(
                      role.id
                    )}
                  />

                  <ListItemText
                    primary={role.name}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Assigning..."
              : "Assign Role"}
          </Button>
        </Stack>
      </Card>

      <ToastContainer />
    </DashboardContent>
  );
}