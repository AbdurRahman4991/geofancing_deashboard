import { useMemo, useState } from 'react';
import { Alert, Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetCompanyQuery } from '../../../../../../redux/service/companySlice';
import { useGetCountryHiearchyLevelsQuery } from '../../../../../../redux/service/countryHiearchyLevelService';
import { useCreateCountryHiearchyNodeMutation, useGetCountryHiearchyNodesQuery } from '../../../../../../redux/service/countryHiearchyNodeService';

type NodeForm = {
  company_id: string;
  hierarchy_level_id: string;
  parent_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  latitude: string;
  longitude: string;
};

export default function CreateNodeView() {
  const currentCompanyId = getCurrentCompanyId();
  const router = useRouter();
  const { data: companyData, isLoading: loadingCompanies } = useGetCompanyQuery(
    { page: 1, limit: 100 }, { skip: Boolean(currentCompanyId) }
  );
  const [form, setForm] = useState<NodeForm>({
    company_id: currentCompanyId ? String(currentCompanyId) : '',
    hierarchy_level_id: '', parent_id: '', name: '', code: '', status: 'active', latitude: '', longitude: '',
  });
  const companyId = currentCompanyId || Number(form.company_id);
  const { data: levelData, isLoading: loadingLevels } = useGetCountryHiearchyLevelsQuery(
    { company_id: companyId, page: 1, per_page: 100 }, { skip: !companyId }
  );
  const { data: nodeData, isLoading: loadingNodes } = useGetCountryHiearchyNodesQuery(
    { company_id: companyId, page: 1, per_page: 100 }, { skip: !companyId }
  );
  const [createNode, { isLoading: saving }] = useCreateCountryHiearchyNodeMutation();
  const levels = levelData?.data ?? [];
  const selectedLevel = levels.find((level) => String(level.id) === form.hierarchy_level_id);
  const parentCandidates = useMemo(() => (nodeData?.data ?? []).filter((node) =>
    (node.level?.level_order ?? Number.MAX_SAFE_INTEGER) < (selectedLevel?.level_order ?? 0)
  ), [nodeData, selectedLevel]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const latitude = form.latitude.trim() ? Number(form.latitude) : null;
    const longitude = form.longitude.trim() ? Number(form.longitude) : null;
    if (!companyId || !form.hierarchy_level_id || !form.name.trim()) {
      toast.error('Company, hierarchy level, and node name are required.');
      return;
    }
    if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
      toast.error('Latitude must be between -90 and 90.');
      return;
    }
    if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
      toast.error('Longitude must be between -180 and 180.');
      return;
    }
    try {
      await createNode({
        company_id: companyId,
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
      toast.success('Country hierarchy node created.');
      router.push('/country-hiearchy-node');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create country hierarchy node.');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Country Hierarchy Node</Typography>
      <Card sx={{ p: 3, maxWidth: 760 }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          {!companyId && <Alert severity="info">Select a company to load its hierarchy levels.</Alert>}
          <TextField select required label="Company" value={form.company_id} disabled={Boolean(currentCompanyId) || loadingCompanies} onChange={(event) => setForm((current) => ({ ...current, company_id: event.target.value, hierarchy_level_id: '', parent_id: '' }))}>
            {(companyData?.data ?? []).map((company) => <MenuItem key={company.id} value={String(company.id)}>{company.company_name}</MenuItem>)}
            {currentCompanyId > 0 && <MenuItem value={String(currentCompanyId)}>My company</MenuItem>}
          </TextField>
          <TextField select required label="Hierarchy level" value={form.hierarchy_level_id} disabled={!companyId || loadingLevels} onChange={(event) => setForm((current) => ({ ...current, hierarchy_level_id: event.target.value, parent_id: '' }))}>
            <MenuItem value="">Select a level</MenuItem>
            {levels.map((level) => <MenuItem key={level.id} value={String(level.id)}>{level.name} (Level {level.level_order})</MenuItem>)}
          </TextField>
          <TextField select label="Parent node" value={form.parent_id} disabled={!selectedLevel || loadingNodes} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))}>
            <MenuItem value="">No parent (root node)</MenuItem>
            {parentCandidates.map((node) => <MenuItem key={node.id} value={String(node.id)}>{node.name} — {node.level?.name ?? 'Parent'}</MenuItem>)}
          </TextField>
          {selectedLevel && !loadingNodes && !parentCandidates.length && <Alert severity="info">No nodes from a higher level are available. This node will be a root node.</Alert>}
          <TextField required label="Node name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} inputProps={{ maxLength: 150 }} />
          <TextField label="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} inputProps={{ maxLength: 100 }} />
          <TextField select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as NodeForm['status'] }))}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Latitude" type="number" value={form.latitude} onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))} inputProps={{ min: -90, max: 90, step: 'any' }} />
            <TextField fullWidth label="Longitude" type="number" value={form.longitude} onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))} inputProps={{ min: -180, max: 180, step: 'any' }} />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => router.push('/country-hiearchy-node')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || loadingLevels || !companyId}>{saving ? 'Saving...' : 'Create node'}</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
