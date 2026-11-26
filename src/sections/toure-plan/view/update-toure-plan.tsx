import { useEffect, useState } from 'react';
import { Alert, Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetGeofencesQuery } from '../../../../redux/service/geofenchSlice';
import { useGetTourPlanQuery, useUpdateTourPlanMutation } from '../../../../redux/service/tourPlanService';

export default function UpdateTourPlanView() {
  const { id } = useParams<{ id: string }>();
  const planId = Number(id);
  const companyId = getCurrentCompanyId();
  const router = useRouter();
  const validId = Boolean(id) && Number.isFinite(planId);
  const { data: plan, isLoading: loadingPlan, isError: planError } = useGetTourPlanQuery(planId, { skip: !validId });
  const { data: geofenceData, isLoading: loadingGeofences } = useGetGeofencesQuery(
    { company_id: companyId, page: 1, per_page: 500 }, { skip: !companyId }
  );
  const [updateTourPlan, { isLoading: saving }] = useUpdateTourPlanMutation();
  const [planDate, setPlanDate] = useState('');
  const [notes, setNotes] = useState('');
  const [stopIds, setStopIds] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const geofences = geofenceData?.data ?? [];

  useEffect(() => {
    if (!plan) return;
    setPlanDate(plan.plan_date?.slice(0, 10) ?? '');
    setNotes(plan.notes ?? '');
    setStopIds(plan.stops?.length
      ? [...plan.stops].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)).map((stop) => String(stop.geofence_id))
      : ['']);
  }, [plan]);

  const updateStop = (index: number, value: string) => {
    setStopIds((current) => current.map((stop, i) => i === index ? value : stop));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validStops = stopIds.filter(Boolean);
    if (!planDate || validStops.length === 0 || new Set(validStops).size !== validStops.length) {
      setError('Choose a plan date and at least one unique geofence stop.');
      return;
    }
    setError('');
    try {
      await updateTourPlan({
        id: planId,
        body: {
          plan_date: planDate,
          notes: notes.trim() || null,
          stops: validStops.map((geofenceId) => ({ geofence_id: Number(geofenceId), planned_arrival_time: null })),
        },
      }).unwrap();
      router.push('/tour-plan');
    } catch (requestError: any) {
      setError(requestError?.data?.message || 'Could not update the tour plan. Check the form and try again.');
    }
  };

  if (loadingPlan) return <DashboardContent><Typography>Loading tour plan...</Typography></DashboardContent>;
  if (planError || !plan) return <DashboardContent><Stack spacing={2}><Alert severity="error">Could not load this tour plan.</Alert><Button onClick={() => router.push('/tour-plan')}>Back to tour plans</Button></Stack></DashboardContent>;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Edit Tour Plan</Typography>
      <Card sx={{ p: 3, maxWidth: 760 }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          {!companyId && <Alert severity="warning">Your account has no company assigned. Tour plans require a company.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Plan date" type="date" value={planDate} onChange={(event) => setPlanDate(event.target.value)} InputLabelProps={{ shrink: true }} required />
          <TextField label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} multiline minRows={3} inputProps={{ maxLength: 5000 }} />
          <Typography variant="h6">Stops</Typography>
          {stopIds.map((stopId, index) => (
            <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField select fullWidth label={`Stop ${index + 1}`} value={stopId} onChange={(event) => updateStop(index, event.target.value)} disabled={loadingGeofences}>
                <MenuItem value="">Select a geofence</MenuItem>
                {geofences.map((geofence) => <MenuItem key={geofence.id} value={String(geofence.id)}>{geofence.firm_name}{geofence.address ? ` — ${geofence.address}` : ''}</MenuItem>)}
              </TextField>
              {stopIds.length > 1 && <Button color="error" onClick={() => setStopIds((current) => current.filter((_, i) => i !== index))}>Remove</Button>}
            </Stack>
          ))}
          {!loadingGeofences && geofences.length === 0 && <Alert severity="info">No geofences are available for this company.</Alert>}
          <Button variant="outlined" onClick={() => setStopIds((current) => [...current, ''])}>Add stop</Button>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => router.push('/tour-plan')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || loadingGeofences || !companyId || !geofences.length}>{saving ? 'Saving...' : 'Update tour plan'}</Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
