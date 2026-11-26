import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetCompanyQuery } from '../../../../../../redux/service/companySlice';
import { useGetCountryHiearchyLevelsQuery } from '../../../../../../redux/service/countryHiearchyLevelService';
import {
  useGetCountryHiearchyNodeQuery,
  useGetCountryHiearchyNodesQuery,
  useUpdateCountryHiearchyNodeMutation,
} from '../../../../../../redux/service/countryHiearchyNodeService';

type NodeForm = {
  hierarchy_level_id: string;
  parent_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  latitude: string;
  longitude: string;
};

export default function UpdateNodeView() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const nodeId = Number(id);
  const currentCompanyId = getCurrentCompanyId();
  const routeCompanyId = Number(searchParams.get('company_id'));
  const companyId = currentCompanyId || (Number.isInteger(routeCompanyId) && routeCompanyId > 0 ? routeCompanyId : 0);
  const router = useRouter();
  const { data: companyData } = useGetCompanyQuery({ page: 1, limit: 100 }, { skip: Boolean(currentCompanyId) });
  const { data: node, isLoading: loadingNode, isError } = useGetCountryHiearchyNodeQuery(
    { company_id: companyId, id: nodeId }, { skip: !companyId || !id || !Number.isFinite(nodeId) }
  );
  const { data: levelData, isLoading: loadingLevels } = useGetCountryHiearchyLevelsQuery(
    { company_id: companyId, page: 1, per_page: 100 }, { skip: !companyId }
  );
  const { data: nodesData, isLoading: loadingNodes } = useGetCountryHiearchyNodesQuery(
    { company_id: companyId, page: 1, per_page: 100 }, { skip: !companyId }
  );
  const [updateNode, { isLoading: saving }] = useUpdateCountryHiearchyNodeMutation();
  const [form, setForm] = useState<NodeForm>({ hierarchy_level_id: '', parent_id: '', name: '', code: '', status: 'active', latitude: '', longitude: '' });
  const levels = levelData?.data ?? [];
  const selectedLevel = levels.find((level) => String(level.id) === form.hierarchy_level_id);
  const parentCandidates = useMemo(() => (nodesData?.data ?? []).filter((candidate) =>
    candidate.id !== nodeId && (candidate.level?.level_order ?? Number.MAX_SAFE_INTEGER) < (selectedLevel?.level_order ?? 0)
  ), [nodesData, nodeId, selectedLevel]);

  useEffect(() => {
    if (!node) return;
    setForm({
      hierarchy_level_id: String(node.hierarchy_level_id),
      parent_id: node.parent_id ? String(node.parent_id) : '',
      name: node.name ?? '',
      code: node.code ?? '',
      status: node.status,
      latitude: node.latitude === null ? '' : String(node.latitude),
      longitude: node.longitude === null ? '' : String(node.longitude),
    });
  }, [node]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!node || !form.hierarchy_level_id || !form.name.trim()) {
      toast.error('Hierarchy level and node name are required.');
      return;
    }
    const latitude = form.latitude.trim() ? Number(form.latitude) : null;
    const longitude = form.longitude.trim() ? Number(form.longitude) : null;
    if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
      toast.error('Latitude must be between -90 and 90.');
      return;
    }
    if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
      toast.error('Longitude must be between -180 and 180.');
      return;
    }
    try {
      await updateNode({
        company_id: node.company_id,
        id: node.id,
        data: {
          hierarchy_level_id: Number(form.hierarchy_level_id),
          parent_id: form.parent_id ? Number(form.parent_id) : null,
          name: form.name.trim(),
          code: form.code.trim() || null,
          status: form.status,
          latitude,
          longitude,
        },
      }).unwrap();
      toast.success('Country hierarchy node updated.');
      router.push('/country-hiearchy-node');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update country hierarchy node.');
    }
  };

  if (loadingNode) return <DashboardContent><Typography>Loading country hierarchy node...</Typography></DashboardContent>;
  if (isError || !node) return <DashboardContent><Stack spacing={2}><Alert severity="error">Could not load this node. Check the company scope and node ID.</Alert><Button onClick={() => router.push('/country-hiearchy-node')}>Back to nodes</Button></Stack></DashboardContent>;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Edit Country Hierarchy Node</Typography>
      <Card sx={{ p: 3, maxWidth: 760 }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <TextField select label="Company" value={String(node.company_id)} disabled>
            {(companyData?.data ?? []).map((company) => <MenuItem key={company.id} value={String(company.id)}>{company.company_name}</MenuItem>)}
            {!companyData && <MenuItem value={String(node.company_id)}>Company #{node.company_id}</MenuItem>}
          </TextField>
          <TextField select required label="Hierarchy level" value={form.hierarchy_level_id} disabled={loadingLevels} onChange={(event) => setForm((current) => ({ ...current, hierarchy_level_id: event.target.value, parent_id: '' }))}>
            {levels.map((level) => <MenuItem key={level.id} value={String(level.id)}>{level.name} (Level {level.level_order})</MenuItem>)}
          </TextField>
          <TextField select label="Parent node" value={form.parent_id} disabled={loadingNodes} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))}>
            <MenuItem value="">No parent (root node)</MenuItem>
            {parentCandidates.map((candidate) => <MenuItem key={candidate.id} value={String(candidate.id)}>{candidate.name} — {candidate.level?.name ?? 'Parent'}</MenuItem>)}
          </TextField>
          {selectedLevel && !loadingNodes && !parentCandidates.length && <Alert severity="info">No nodes from a higher level are available. Choose no parent to make this a root node.</Alert>}
          <TextField required label="Node name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} inputProps={{ maxLength: 150 }} />
          <TextField label="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} inputProps={{ maxLength: 100 }} />
          <TextField select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as NodeForm['status'] }))}>
            <MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Latitude" type="number" value={form.latitude} onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))} inputProps={{ min: -90, max: 90, step: 'any' }} />
            <TextField fullWidth label="Longitude" type="number" value={form.longitude} onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))} inputProps={{ min: -180, max: 180, step: 'any' }} />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => router.push('/country-hiearchy-node')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || loadingLevels}>{saving ? 'Saving...' : 'Update node'}</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
