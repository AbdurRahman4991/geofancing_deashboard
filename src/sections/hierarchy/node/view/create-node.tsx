import { useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetLevelsQuery } from '../../../../../redux/service/levelSlice';
import { useCreateNodeMutation, useGetNodesQuery, type NodeStatus } from '../../../../../redux/service/nodeSlice';

const COMPANY_ID = getCurrentCompanyId();

type NodeForm = {
  company_id: string;
  hierarchy_level_id: string;
  parent_id: string;
  name: string;
  code: string;
  status: NodeStatus;
};

export default function CreateNodeView() {
  const [createNode, { isLoading: isCreating }] = useCreateNodeMutation();
  const { data: companyData, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyData?.data ?? [];
  const { data: levelData, isLoading: isLevelsLoading } = useGetLevelsQuery({
    company_id: COMPANY_ID,
    page: 1,
    per_page: 100,
  });
  const levels = levelData?.data?.data ?? [];  
  const { data: nodeData } = useGetNodesQuery({
    company_id: COMPANY_ID,
    page: 1,
    per_page: 100,
  });
  const nodes = nodeData?.data?.data ?? [];

  const [form, setForm] = useState<NodeForm>({
    company_id: COMPANY_ID ? String(COMPANY_ID) : '',
    hierarchy_level_id: '',
    parent_id: '',
    name: '',
    code: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NodeForm, string>>>({});

  const selectedLevel = levels.find((level) => String(level.id) === form.hierarchy_level_id);
  const parentOptions = selectedLevel
    ? nodes.filter(
        (node) => Number(node.level?.level_order) === Number(selectedLevel.level_order) - 1
      )
    : [];

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof NodeForm, string>> = {};
    if (!form.company_id) nextErrors.company_id = 'Logged-in user company is missing';
    if (!form.hierarchy_level_id) nextErrors.hierarchy_level_id = 'Hierarchy level is required';
    if (!form.name.trim()) nextErrors.name = 'Node name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createNode({
        company_id: COMPANY_ID,
        hierarchy_level_id: Number(form.hierarchy_level_id),
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        name: form.name.trim(),
        code: form.code.trim() || null,
        status: form.status,
      }).unwrap();

      toast.success('Node created successfully');
      setForm((previous) => ({
        ...previous,
        hierarchy_level_id: '',
        parent_id: '',
        name: '',
        code: '',
        status: 'active',
      }));
      setErrors({});
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create node');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create  Node</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            select
            required
            label="Company"
            value={form.company_id}
            error={!!errors.company_id}
            helperText={errors.company_id}
            disabled={isCompaniesLoading || !COMPANY_ID}
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
              const selectedLevelId = String(event.target.value);
              const nextLevel = levels.find((level) => String(level.id) === selectedLevelId);
              const matchingParents = nextLevel
                ? nodes.filter(
                    (node) => Number(node.level?.level_order) === Number(nextLevel.level_order) - 1
                  )
                : [];

              console.log('[CreateNode] Hierarchy level changed', {
                selectedLevelId,
                selectedLevel: nextLevel,
                companyId: COMPANY_ID,
                nodesCount: nodes.length,
                nodeLevels: nodes.map((node) => ({
                  id: node.id,
                  name: node.name,
                  levelOrder: node.level?.level_order,
                })),
                parentOptions: matchingParents.map((node) => ({ id: node.id, name: node.name })),
              });

              setForm((previous) => ({ ...previous, hierarchy_level_id: selectedLevelId, parent_id: '' }));
              setErrors((previous) => ({ ...previous, hierarchy_level_id: '' }));
            }}
            error={!!errors.hierarchy_level_id}
            helperText={errors.hierarchy_level_id}
            disabled={isLevelsLoading}
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
            disabled={!form.hierarchy_level_id}
            fullWidth
          >
            <MenuItem value="">No parent</MenuItem>
            {parentOptions.map((node) => (
              <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
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
            disabled={isCreating || isCompaniesLoading || isLevelsLoading}
          >
            {isCreating ? 'Saving...' : 'Create Node'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
