import { useState } from "react";

import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  Checkbox,
  Typography,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGetRolesQuery } from "../../../../redux/service/roleSlice";

import {
  useGetPermissionGroupsQuery,
  useAssignPermissionMutation,
} from "../../../../redux/service/permissionSlice";

export default function AssignPermissionView() {
  const [roleId, setRoleId] = useState<number | "">("");

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // ==========================
  // Role List
  // ==========================

  const {
    data: roleData,
    isLoading: roleLoading,
  } = useGetRolesQuery();

  // ==========================
  // Permission Groups
  // ==========================

  const {
    data: permissionGroups,
    isLoading: permissionLoading,
  } = useGetPermissionGroupsQuery();

  // ==========================
  // Mutation
  // ==========================

  const [assignPermission, { isLoading }] =
    useAssignPermissionMutation();

  const roles = roleData?.data ?? [];

  // ==========================
  // Checkbox Toggle
  // ==========================

  const handleToggle = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async () => {
    if (!roleId) {
      toast.error("Please select role");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Please select permission");
      return;
    }

    try {
      await assignPermission({
        roleId,
        permissions: selectedPermissions,
      }).unwrap();

      toast.success("Permission assigned successfully");

      setRoleId("");
      setSelectedPermissions([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Assign failed");
    }
  };

  if (roleLoading || permissionLoading) {
    return (
      <DashboardContent>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Assign Permission
      </Typography>

      <Card
        sx={{
          p: 4,
          maxWidth: 900,
        }}
      >
        <Stack spacing={4}>
          {/* Role */}

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>

            <Select
              value={roleId}
              label="Role"
              onChange={(e) => setRoleId(Number(e.target.value))}
            >
              {roles.map((role: any) => (
                <MenuItem
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Permission Groups */}

          {permissionGroups &&
            Object.entries(permissionGroups).map(
              ([group, permissions]: any) => (
                <Box key={group}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      textTransform: "capitalize",
                      fontWeight: 700,
                    }}
                  >
                    {group}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <FormGroup row>
                    {permissions.map((permission: any) => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handleToggle(permission.id)
                            }
                          />
                        }
                        label={permission.name}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )
            )}

          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Assigning..."
              : "Assign Permission"}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}