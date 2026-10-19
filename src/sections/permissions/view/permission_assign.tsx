import { useEffect, useState } from "react";

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
import { getCurrentUser } from "src/utils/auth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGetRolesQuery } from "../../../../redux/service/roleSlice";

import {
  useGetPermissionGroupsQuery,
  useGetRolePermissionsQuery,
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

  const {
  data: rolePermissions,
  isLoading: rolePermissionLoading,
} = useGetRolePermissionsQuery(roleId, {
  skip: !roleId,
});

useEffect(() => {
  if (rolePermissions) {
    const permissionIds = rolePermissions.map(
      (permission: any) => permission.id
    );

    setSelectedPermissions(permissionIds);
  } else {
    setSelectedPermissions([]);
  }
}, [rolePermissions]);

  // ==========================
  // Mutation
  // ==========================

  const [assignPermission, { isLoading }] =
    useAssignPermissionMutation();

  const roles = roleData?.data ?? [];
  const allPermissionIds: number[] = Object.values(permissionGroups ?? {}).flatMap(
    (permissions: any) => permissions.map((permission: any) => permission.id)
  );
  const allPermissionsChecked = allPermissionIds.length > 0 && allPermissionIds.every((id) => selectedPermissions.includes(id));
  const somePermissionsChecked = allPermissionIds.some((id) => selectedPermissions.includes(id));

  useEffect(() => {
    if (!roles.length) return;

    const userRoles = getCurrentUser().roles ?? [];
    const normalizeRole = (name: string) => name.toLowerCase().replace(/[_-]/g, " ");
    const matchingRole = roles.find((role: any) =>
      userRoles.some((userRole) => {
        const userRoleName = typeof userRole === "string" ? userRole : userRole.name;
        return userRoleName && normalizeRole(userRoleName) === normalizeRole(role.name);
      })
    );

    if (matchingRole) setRoleId(matchingRole.id);
  }, [roles]);

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

  const handleToggleMany = (ids: number[]) => {
    setSelectedPermissions((previous) => {
      const areAllSelected = ids.length > 0 && ids.every((id) => previous.includes(id));
      return areAllSelected
        ? previous.filter((id) => !ids.includes(id))
        : Array.from(new Set([...previous, ...ids]));
    });
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
        Assign Permission ?
      </Typography>

      <Card
        sx={{
          p: 4,
          maxWidth: 900,
        }}
      >
        <Stack spacing={4}>
          {/* Role and action */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleId}
                label="Role"
                onChange={(e) => setRoleId(Number(e.target.value))}
              >
                {roles.map((role: any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
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
              sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
            >
              {isLoading ? "Assigning..." : "Assign Permission"}
            </Button>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={allPermissionsChecked}
                indeterminate={somePermissionsChecked && !allPermissionsChecked}
                onChange={() => handleToggleMany(allPermissionIds)}
              />
            }
            label="Select all permissions"
          />

          {/* Permission Groups */}

          {permissionGroups &&
            Object.entries(permissionGroups).map(
              ([group, permissions]: any) => (
                <Box key={group}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={permissions.length > 0 && permissions.every((permission: any) => selectedPermissions.includes(permission.id))}
                        indeterminate={permissions.some((permission: any) => selectedPermissions.includes(permission.id)) && !permissions.every((permission: any) => selectedPermissions.includes(permission.id))}
                        onChange={() => handleToggleMany(permissions.map((permission: any) => permission.id))}
                      />
                    }
                    label={
                      <Typography sx={{ textTransform: "capitalize", fontWeight: 700 }}>
                        {group}
                      </Typography>
                    }
                  />

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
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}