import { useEffect, useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetLevelsQuery } from '../../../../../redux/service/levelSlice';
import {
  useGetNodesQuery,
  useGetSingleNodeQuery,
  useUpdateNodeMutation,
  type NodeStatus,
} from '../../../../../redux/service/nodeSlice';

const COMPANY_ID = 1;

type NodeForm = {
  company_id: string;
  hierarchy_level_id: string;
  parent_id: string;
  name: string;
  code: string;
  status: NodeStatus;
};

export default function UpdateNodeView() {
  const { id } = useParams<{ id: string }>();
  const nodeId = Number(id);
  const {
    data: node,
    isLoading: isFetchingNode,
    isError: isNodeError,
  } = useGetSingleNodeQuery(
    { id: nodeId, company_id: COMPANY_ID },
    { skip: !id || !Number.isFinite(nodeId) }
  );
  const { data: companyData, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const { data: levelData, isLoading: isLevelsLoading } = useGetLevelsQuery({
    company_id: COMPANY_ID,
    page: 1,
    per_page: 100,
  });
  const { data: nodeData } = useGetNodesQuery({
    company_id: COMPANY_ID,
    page: 1,
    per_page: 100,
  });
  const companies = companyData?.data ?? [];
  const levels = levelData?.data?.data ?? [];
  const nodes = nodeData?.data?.data ?? [];
  const [updateNode, { isLoading: isUpdating }] = useUpdateNodeMutation();

  const [form, setForm] = useState<NodeForm>({
    company_id: String(COMPANY_ID),
    hierarchy_level_id: '',
    parent_id: '',
    name: '',
    code: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NodeForm, string>>>({});

  useEffect(() => {
    if (node) {
      setForm({
        company_id: String(node.company_id),
        hierarchy_level_id: String(node.hierarchy_level_id),
        parent_id: node.parent_id == null ? '' : String(node.parent_id),
        name: node.name ?? '',
        code: node.code ?? '',
        status: node.status,
      });
    }
  }, [node]);

  const selectedLevel = levels.find((level) => String(level.id) === form.hierarchy_level_id);
  const parentOptions = nodes.filter(
    (candidate) =>
      candidate.id !== nodeId &&
      candidate.level?.level_order === (selectedLevel?.level_order ?? 0) - 1
  );

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof NodeForm, string>> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.hierarchy_level_id) nextErrors.hierarchy_level_id = 'Hierarchy level is required';
    if (!form.name.trim()) nextErrors.name = 'Node name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!id || !Number.isFinite(nodeId)) {
      toast.error('Node ID is missing or invalid');
      return;
    }

    try {
      await updateNode({
        id: nodeId,
        data: {
          company_id: Number(form.company_id),
          hierarchy_level_id: Number(form.hierarchy_level_id),
          parent_id: form.parent_id ? Number(form.parent_id) : null,
          name: form.name.trim(),
          code: form.code.trim() || null,
          status: form.status,
        },
      }).unwrap();
      toast.success('Node updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update node');
    }
  };

  if (isFetchingNode || isCompaniesLoading || isLevelsLoading) {
    return <DashboardContent><Typography>Loading node...</Typography></DashboardContent>;
  }

  if (isNodeError || !node) {
    return <DashboardContent><Typography color="error">Failed to load node.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Hierarchy Node</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            select
            required
            label="Company"
            value={form.company_id}
            onChange={(event) => setForm((previous) => ({ ...previous, company_id: event.target.value }))}
            error={!!errors.company_id}
            helperText={errors.company_id}
            fullWidth
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>{company.company_name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            required
            label="Hierarchy Level"
            value={form.hierarchy_level_id}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, hierarchy_level_id: event.target.value, parent_id: '' }));
              setErrors((previous) => ({ ...previous, hierarchy_level_id: '' }));
            }}
            error={!!errors.hierarchy_level_id}
            helperText={errors.hierarchy_level_id}
            fullWidth
          >
            {levels.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.name} (Order {level.level_order})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Parent Node"
            value={form.parent_id}
            onChange={(event) => setForm((previous) => ({ ...previous, parent_id: event.target.value }))}
            fullWidth
          >
            <MenuItem value="">No parent</MenuItem>
            {parentOptions.map((candidate) => (
              <MenuItem key={candidate.id} value={candidate.id}>{candidate.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            required
            label="Node Name"
            value={form.name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, name: event.target.value }));
              setErrors((previous) => ({ ...previous, name: '' }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Code"
            value={form.code}
            onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))}
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as NodeStatus }))}
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Node'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
