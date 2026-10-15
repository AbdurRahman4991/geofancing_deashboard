import { useEffect, useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetNodesQuery, type HierarchyNode } from '../../../../../redux/service/nodeSlice';
import { useGetUsersQuery, type UserRecord } from '../../../../../redux/service/userSlice';
import { useAssignUserMutation } from '../../../../../redux/service/employeeHierarchyAssignmentSlice';

const getLoggedInCompanyId = (): number => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = Number(user.company_id ?? user.employee?.company_id);
    return Number.isInteger(companyId) && companyId > 0 ? companyId : 0;
  } catch {
    return 0;
  }
};

const COMPANY_ID = getLoggedInCompanyId();

export default function CreateNodeView() {
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useGetUsersQuery({ page: 1, per_page: 100 });
  const users = usersData?.data ?? [];
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const {
    data: nodeData,
    isLoading: isNodesLoading,
    isError: isNodesError,
    error: nodeError,
    refetch: refetchNodes,
  } = useGetNodesQuery(
    { company_id: COMPANY_ID, page: 1, per_page: 100 },
    { skip: !COMPANY_ID }
  );
  const nodes = nodeData?.data?.data ?? [];
  const [nodePath, setNodePath] = useState<string[]>([]);
  const [assignUser, { isLoading: isAssigning }] = useAssignUserMutation();
  useEffect(() => {
    const responseNodes = nodeData?.data?.data ?? [];
    const rootNodes = responseNodes.filter(
      (node) => node.parent_id == null || Number(node.parent_id) === 0
    );

    console.groupCollapsed('[NodeAssign] hierarchy node query');
    console.log('Request params:', { company_id: COMPANY_ID, page: 1, per_page: 100 });
    console.log('Query state:', { isNodesLoading, isNodesError, hasData: Boolean(nodeData) });
    if (nodeError) console.error('Node query error:', nodeError);
    console.log('Response shape:', {
      topLevelKeys: nodeData ? Object.keys(nodeData) : [],
      dataKeys: nodeData?.data ? Object.keys(nodeData.data) : [],
    });
    console.log('Node counts:', { total: responseNodes.length, roots: rootNodes.length });
    console.table(responseNodes.map((node) => ({
      id: node.id,
      parent_id: node.parent_id,
      hierarchy_level_id: node.hierarchy_level_id,
      level: node.level?.name,
    })));
    console.groupEnd();
  }, [isNodesLoading, isNodesError, nodeData, nodeError]);

  useEffect(() => {
    if (!nodePath.length) return;
    const parentId = Number(nodePath[nodePath.length - 1]);
    const children = nodes.filter((node) => Number(node.parent_id) === parentId);
    console.log('[NodeAssign] selected parent and children:', {
      selectedPath: nodePath,
      parentId,
      childCount: children.length,
      childIds: children.map((node) => node.id),
    });
  }, [nodePath, nodeData]);

  const nodeSelects: { depth: number; options: HierarchyNode[]; value: string; label: string }[] = [];
  let options = nodes.filter(
    (node) => node.parent_id == null || Number(node.parent_id) === 0
  );
  for (let depth = 0; options.length > 0; depth += 1) {
    const value = nodePath[depth] ?? '';
    nodeSelects.push({
      depth,
      options,
      value,
      label: options[0].level?.name ?? (depth === 0 ? 'Parent Node' : 'Child Node'),
    });

    if (!value) break;
    const selectedNode = options.find((node) => String(node.id) === value);
    if (!selectedNode) break;
    options = nodes.filter((node) => Number(node.parent_id) === Number(selectedNode.id));
  }

  const selectedNodeId = nodePath[nodePath.length - 1] ?? '';

  const handleSubmit = async () => {
    if (!selectedUser || !selectedNodeId) {
      toast.error('Please select a user and a hierarchy node.');
      return;
    }

    try {
      await assignUser({ user_id: selectedUser.id, hierarchy_node_id: Number(selectedNodeId) }).unwrap();
      toast.success('Node assigned successfully');
      setSelectedUser(null);
      setNodePath([]);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to assign node to user');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Assign Node to User</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <Autocomplete
            options={users}
            value={selectedUser}
            loading={usersLoading}
            onChange={(_event, user) => setSelectedUser(user)}
            getOptionLabel={(user) => `${user.name ?? user.employee?.name ?? 'User'}${user.employee?.employee_id ? ` (${user.employee.employee_id})` : ''}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={usersLoading ? 'Loading users…' : usersError ? 'Failed to load users' : 'No users found'}
            renderInput={(params) => <TextField {...params} required label="Select User" error={usersError} helperText={usersLoading ? 'Loading users…' : usersError ? 'Failed to load users. Check your connection and try again.' : `${users.length} users available`} />}
          />

          {!COMPANY_ID && (
            <Typography color="error">Company ID is missing from the logged-in user.</Typography>
          )}
          {isNodesLoading && <Typography>Loading hierarchy nodes…</Typography>}
          {isNodesError && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="error">
                {(nodeError as any)?.data?.message || 'Failed to load hierarchy nodes.'}
              </Typography>
              <Button size="small" onClick={() => refetchNodes()}>Retry</Button>
            </Stack>
          )}
          {!isNodesLoading && !isNodesError && COMPANY_ID > 0 && nodes.length === 0 && (
            <Typography color="text.secondary">No hierarchy nodes found for this company.</Typography>
          )}
          {!isNodesLoading && !isNodesError && nodes.length > 0 && nodeSelects.length === 0 && (
            <Typography color="text.secondary">No parent nodes found. Check the nodes’ parent relationship.</Typography>
          )}

          {nodeSelects.map(({ depth, options: nodeOptions, value, label }) => (
            <TextField
              key={depth}
              select
              required
              label={depth === 0 ? 'Parent Node' : label}
              value={value}
              onChange={(event) => {
                const nextValue = String(event.target.value);
                const selectedNode = nodeOptions.find((node) => String(node.id) === nextValue);
                const childNodes = selectedNode
                  ? nodes.filter((node) => Number(node.parent_id) === Number(selectedNode.id))
                  : [];
                console.log('[NodeAssign] dropdown changed:', {
                  depth,
                  selectedValue: nextValue,
                  selectedNodeId: selectedNode?.id,
                  selectedNodeName: selectedNode?.name,
                  childCount: childNodes.length,
                  childIds: childNodes.map((node) => node.id),
                });
                setNodePath((current) =>
                  nextValue
                    ? [...current.slice(0, depth), nextValue]
                    : current.slice(0, depth)
                );
              }}
              disabled={isNodesLoading || isNodesError || !COMPANY_ID}
              helperText={depth === 0 && isNodesLoading ? 'Loading nodes...' : depth === 0 && isNodesError ? 'Could not load nodes.' : depth === 0 && !COMPANY_ID ? 'Company is missing from the logged-in user.' : ''}
              fullWidth
            >
              <MenuItem value="">Select {depth === 0 ? 'parent' : 'child'}</MenuItem>
              {nodeOptions.map((node) => (
                <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
              ))}
            </TextField>
          ))}
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            disabled={isAssigning || usersLoading || isNodesLoading || !users.length || !nodes.length}
          >
            {isAssigning ? 'Assigning...' : 'Assign Node'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}


