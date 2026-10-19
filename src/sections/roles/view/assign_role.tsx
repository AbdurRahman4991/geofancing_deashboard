import { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { isSuperAdmin } from "src/utils/auth";
import { useGetCompanyQuery } from "../../../../redux/service/companySlice";
import { toast, ToastContainer } from "react-toastify";

import { useGetAssignRoleUsersQuery } from "../../../../redux/service/userSlice";
import {
  useGetRolesQuery,
  useAssignRoleMutation,
} from "../../../../redux/service/roleSlice";

export default function AssignRoleView() {
  const location = useLocation();
  const initialAssignment = location.state as {
    userId?: number;
    roleIds?: number[];
  } | null;
  const isAdmin = isSuperAdmin();
  const [companyId, setCompanyId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">(initialAssignment?.userId ?? "");
  const [selectedRoles, setSelectedRoles] = useState<number[]>(initialAssignment?.roleIds ?? []);

  // ===========================
  // User List
  // ===========================
  const { data: companyData, isLoading: companyLoading } = useGetCompanyQuery(
    { page: 1, limit: 100 },
    { skip: !isAdmin }
  );
  const companies = companyData?.data ?? [];
  const { data: userData, isLoading: userLoading } = useGetAssignRoleUsersQuery(
    { page: 1, per_page: 100, search: "", ...(isAdmin && companyId ? { company_id: companyId } : {}) },
    { skip: isAdmin && !companyId }
  );

  // ===========================
  // Role List
  // ===========================
  const { data: roleData, isLoading: roleLoading } = useGetRolesQuery(
    isAdmin && companyId ? { company_id: companyId } : undefined,
    { skip: isAdmin && !companyId }
  );

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

  if (companyLoading || userLoading || roleLoading) {
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
          {isAdmin && (
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={companyId}
                label="Company"
                onChange={(event) => {
                  setCompanyId(Number(event.target.value));
                  setUserId("");
                  setSelectedRoles([]);
                }}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* User */}

          <FormControl fullWidth disabled={isAdmin && !companyId}>
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

          <FormControl fullWidth disabled={isAdmin && !companyId}>
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
            disabled={isLoading || (isAdmin && !companyId)}
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
