import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Autocomplete, Card, Stack, TextField, Button, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetSingleGeofenceQuery,
  useUpdateGeofenceMutation,
} from '../../../../redux/service/geofenchSlice';
import { useGetNodesQuery } from '../../../../redux/service/nodeSlice';

type GeofenceForm = {
  company_id: string;
  hierarchy_node_id: string;
  firm_name: string;
  address: string;
  latitude: string;
  longitude: string;
  radius: string;
};

export default function GeofenceUpdateView() {
  const { id } = useParams<{ id: string }>();
  const { data: geofence, isLoading: isFetching, isError } = useGetSingleGeofenceQuery(Number(id), {
    skip: !id || Number.isNaN(Number(id)),
  });
  const companyId = Number(geofence?.company_id ?? getCurrentCompanyId());
  const { data: nodesData, isLoading: isNodesLoading, isError: isNodesError } = useGetNodesQuery(
    { company_id: companyId, page: 1, per_page: 500 },
    { skip: !Number.isInteger(companyId) || companyId <= 0 }
  );
  const nodes = nodesData?.data?.data ?? [];
  const [updateGeofence, { isLoading }] = useUpdateGeofenceMutation();
  const [selectedHierarchyLevelId, setSelectedHierarchyLevelId] = useState('');
  const [form, setForm] = useState<GeofenceForm>({
    company_id: '',
    hierarchy_node_id: '',
    firm_name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GeofenceForm, string>>>({});
  const nodesInSelectedLevel = nodes.filter(
    (node) => String(node.hierarchy_level_id) === selectedHierarchyLevelId
  );

  useEffect(() => {
    if (!geofence) return;
    setForm({
      company_id: String(geofence.company_id ?? ''),
      hierarchy_node_id: geofence.hierarchy_node_id == null ? '' : String(geofence.hierarchy_node_id),
      firm_name: geofence.firm_name ?? '',
      address: geofence.address ?? '',
      latitude: String(geofence.latitude ?? ''),
      longitude: String(geofence.longitude ?? ''),
      radius: String(geofence.radius ?? ''),
    });
  }, [geofence]);

  useEffect(() => {
    if (geofence?.hierarchy_node_id == null || !nodes.length) return;
    const selectedNode = nodes.find((node) => node.id === geofence.hierarchy_node_id);
    if (selectedNode) {
      setSelectedHierarchyLevelId(String(selectedNode.hierarchy_level_id));
    }
  }, [geofence, nodes]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
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
    if (!validate() || !id) return;

    try {
      await updateGeofence({
        id: Number(id),
        data: {
          company_id: Number(form.company_id),
          hierarchy_node_id: form.hierarchy_node_id ? Number(form.hierarchy_node_id) : null,
          firm_name: form.firm_name.trim(),
          address: form.address.trim() || null,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          radius: Number(form.radius),
        },
      }).unwrap();
      toast.success('Geofence updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update geofence');
    }
  };

  if (isFetching) {
    return <DashboardContent><Typography>Loading geofence...</Typography></DashboardContent>;
  }

  if (isError || !geofence) {
    return <DashboardContent><Typography color="error">Failed to load geofence.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Geofence</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField name="company_id" label="Company ID" type="number" value={form.company_id} onChange={handleChange} error={!!errors.company_id} helperText={errors.company_id} required />
          <TextField name="firm_name" label="Firm Name" value={form.firm_name} onChange={handleChange} error={!!errors.firm_name} helperText={errors.firm_name} required />
          <Autocomplete
            options={nodesInSelectedLevel}
            value={nodesInSelectedLevel.find((node) => String(node.id) === form.hierarchy_node_id) ?? null}
            getOptionLabel={(node) => node.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isNodesLoading}
            disabled={isNodesLoading || isNodesError || !selectedHierarchyLevelId}
            onChange={(_, node) => setForm((current) => ({
              ...current,
              hierarchy_node_id: node ? String(node.id) : '',
            }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Hierarchy Node (optional)"
                error={!!errors.hierarchy_node_id || isNodesError}
                helperText={errors.hierarchy_node_id || (isNodesLoading ? 'Loading hierarchy nodes...' : isNodesError ? 'Could not load hierarchy nodes.' : selectedHierarchyLevelId ? `Search nodes in the current ${nodesInSelectedLevel[0]?.level?.name ?? 'hierarchy'} level.` : 'The current assignment has no hierarchy node.')}
              />
            )}
          />
          <TextField name="address" label="Address (optional)" value={form.address} onChange={handleChange} multiline minRows={2} />
          <TextField name="latitude" label="Latitude" type="number" inputProps={{ step: 'any', min: -90, max: 90 }} value={form.latitude} onChange={handleChange} error={!!errors.latitude} helperText={errors.latitude} required />
          <TextField name="longitude" label="Longitude" type="number" inputProps={{ step: 'any', min: -180, max: 180 }} value={form.longitude} onChange={handleChange} error={!!errors.longitude} helperText={errors.longitude} required />
          <TextField name="radius" label="Radius (meters)" type="number" inputProps={{ min: 1, step: 1 }} value={form.radius} onChange={handleChange} error={!!errors.radius} helperText={errors.radius} required />
          <Button variant="contained" size="large" fullWidth color="inherit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Geofence'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
