import { useState } from 'react';
import { Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateGeofenceMutation } from '../../../../redux/service/geofenchSlice';
import { useGetNodesQuery, type HierarchyNode } from '../../../../redux/service/nodeSlice';

type GeofenceForm = {
  company_id: string;
  hierarchy_node_id: string;
  firm_name: string;
  address: string;
  latitude: string;
  longitude: string;
  radius: string;
};

const emptyForm: GeofenceForm = {
  company_id: '',
  hierarchy_node_id: '',
  firm_name: '',
  address: '',
  latitude: '',
  longitude: '',
  radius: '100',
};

export default function GeofenceCreateView() {
  const [createGeofence, { isLoading }] = useCreateGeofenceMutation();
  const [form, setForm] = useState<GeofenceForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof GeofenceForm, string>>>({});
  const [nodePath, setNodePath] = useState<string[]>([]);
  const companyId = Number(form.company_id || getCurrentCompanyId());
  const { data: nodeData, isLoading: isNodesLoading, isError: isNodesError } = useGetNodesQuery(
    { company_id: companyId, page: 1, per_page: 500 },
    { skip: !Number.isInteger(companyId) || companyId <= 0 }
  );
  const nodes = nodeData?.data?.data ?? [];
  const nodeSelects: { depth: number; options: HierarchyNode[]; value: string; label: string }[] = [];
  let nodeOptions = nodes.filter((node) => node.parent_id == null || Number(node.parent_id) === 0);

  for (let depth = 0; nodeOptions.length > 0; depth += 1) {
    const value = nodePath[depth] ?? '';
    nodeSelects.push({
      depth,
      options: nodeOptions,
      value,
      label: nodeOptions[0].level?.name ?? (depth === 0 ? 'Hierarchy Node' : 'Child Node'),
    });

    if (!value) break;
    const selectedNode = nodeOptions.find((node) => String(node.id) === value);
    if (!selectedNode) break;
    nodeOptions = nodes.filter((node) => Number(node.parent_id) === selectedNode.id);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    if (name === 'company_id') {
      setNodePath([]);
      setForm((current) => ({ ...current, hierarchy_node_id: '' }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof GeofenceForm, string>> = {};
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const radius = Number(form.radius);

    if (!form.company_id.trim() || !Number.isInteger(Number(form.company_id))) {
      nextErrors.company_id = 'Enter a valid company ID';
    }
    if (!form.firm_name.trim()) nextErrors.firm_name = 'Firm name is required';
    if (form.hierarchy_node_id && !Number.isInteger(Number(form.hierarchy_node_id))) {
      nextErrors.hierarchy_node_id = 'Enter a valid hierarchy node ID';
    }
    if (!form.latitude || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      nextErrors.latitude = 'Enter a latitude from -90 to 90';
    }
    if (!form.longitude || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      nextErrors.longitude = 'Enter a longitude from -180 to 180';
    }
    if (!form.radius || !Number.isInteger(radius) || radius <= 0) {
      nextErrors.radius = 'Radius must be a positive whole number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createGeofence({
        company_id: Number(form.company_id),
        hierarchy_node_id: form.hierarchy_node_id ? Number(form.hierarchy_node_id) : null,
        firm_name: form.firm_name.trim(),
        address: form.address.trim() || null,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius: Number(form.radius),
      }).unwrap();
      toast.success('Geofence created successfully');
      setForm({ ...emptyForm });
      setNodePath([]);
      setErrors({});
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create geofence');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Geofence</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField name="company_id" label="Company ID" type="number" value={form.company_id} onChange={handleChange} error={!!errors.company_id} helperText={errors.company_id} required />
          <TextField name="firm_name" label="Firm Name" value={form.firm_name} onChange={handleChange} error={!!errors.firm_name} helperText={errors.firm_name} required />
          {isNodesError && <Typography color="error">Could not load hierarchy nodes for this company.</Typography>}
          {!isNodesLoading && !isNodesError && !nodes.length && companyId > 0 && (
            <Typography color="text.secondary">No hierarchy nodes found for this company.</Typography>
          )}
          {nodeSelects.map(({ depth, options, value, label }) => (
            <TextField
              key={depth}
              select
              label={label}
              value={value}
              disabled={isNodesLoading || isNodesError}
              helperText={depth === 0 && isNodesLoading ? 'Loading hierarchy nodes...' : ''}
              onChange={(event) => {
                const nextValue = String(event.target.value);
                const nextPath = nextValue
                  ? [...nodePath.slice(0, depth), nextValue]
                  : nodePath.slice(0, depth);
                setNodePath(nextPath);
                setForm((current) => ({
                  ...current,
                  hierarchy_node_id: nextPath[nextPath.length - 1] ?? '',
                }));
              }}
              fullWidth
            >
              <MenuItem value="">No node selected</MenuItem>
              {options.map((node) => (
                <MenuItem key={node.id} value={String(node.id)}>{node.name}</MenuItem>
              ))}
            </TextField>
          ))}
          <TextField name="address" label="Address (optional)" value={form.address} onChange={handleChange} multiline minRows={2} />
          <TextField name="latitude" label="Latitude" type="number" inputProps={{ step: 'any', min: -90, max: 90 }} value={form.latitude} onChange={handleChange} error={!!errors.latitude} helperText={errors.latitude} required />
          <TextField name="longitude" label="Longitude" type="number" inputProps={{ step: 'any', min: -180, max: 180 }} value={form.longitude} onChange={handleChange} error={!!errors.longitude} helperText={errors.longitude} required />
          <TextField name="radius" label="Radius (meters)" type="number" inputProps={{ min: 1, step: 1 }} value={form.radius} onChange={handleChange} error={!!errors.radius} helperText={errors.radius} required />
          <Button variant="contained" size="large" fullWidth color="inherit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Create Geofence'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
