import { Fragment, useMemo } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

import { DashboardContent } from 'src/layouts/dashboard';
import { ReportExportButtons } from './report-export-buttons';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetGeofencesQuery, type Geofence } from '../../../redux/service/geofenchSlice';
import { useGetNodesQuery } from '../../../redux/service/nodeSlice';

type GeofenceWithNode = Geofence & {
  hierarchy_node?: { id?: number; name?: string } | string | null;
};

const wasVisited = (geofence: GeofenceWithNode) => {
  const status = String(geofence.visit_status ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  return ['visited', 'completed', 'complete', 'yes', 'true', '1'].includes(status);
};

export default function GeofenceMapReport() {
  const companyId = getCurrentCompanyId();
  const { data, isLoading, isError } = useGetGeofencesQuery(
    { company_id: companyId, page: 1, per_page: 1000 },
    { skip: !companyId }
  );
  const { data: nodeResponse } = useGetNodesQuery(
    { company_id: companyId, page: 1, per_page: 1000 },
    { skip: !companyId }
  );
  const geofences = data?.data ?? [];
  const nodesById = useMemo(() => new Map((nodeResponse?.data.data ?? []).map((node) => [node.id, node.name])), [nodeResponse]);
  const validGeofences = useMemo(() => geofences.filter((geofence) =>
    Number.isFinite(Number(geofence.latitude)) && Number.isFinite(Number(geofence.longitude))
  ), [geofences]);
  const center = useMemo<[number, number]>(() => validGeofences.length
    ? [
      validGeofences.reduce((sum, geofence) => sum + Number(geofence.latitude), 0) / validGeofences.length,
      validGeofences.reduce((sum, geofence) => sum + Number(geofence.longitude), 0) / validGeofences.length,
    ]
    : [23.8103, 90.4125], [validGeofences]);
  const visitedCount = geofences.filter((geofence) => wasVisited(geofence as GeofenceWithNode)).length;

  return <DashboardContent>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>Geofence Map Report</Typography>
      <ReportExportButtons />
      <Chip label={`${geofences.length} geofences`} variant="outlined" />
      <Chip label={`${visitedCount} visited`} color="success" variant="outlined" />
      <Chip label={`${geofences.length - visitedCount} not visited`} color="error" variant="outlined" />
    </Stack>

    {!companyId && <Alert severity="warning" sx={{ mb: 2 }}>No company is associated with the current account.</Alert>}
    {isError && <Alert severity="error" sx={{ mb: 2 }}>Could not load geofences for the map.</Alert>}
    {data && data.pagination.total > data.data.length && <Alert severity="info" sx={{ mb: 2 }}>
      Showing {data.data.length} of {data.pagination.total} geofences. Increase the page size to display the full list.
    </Alert>}
    {!isLoading && !isError && validGeofences.length === 0 && companyId > 0 && <Alert severity="info" sx={{ mb: 2 }}>No geofences with valid map coordinates were found.</Alert>}

    <Card sx={{ overflow: 'hidden' }}>
      {isLoading ? <Box sx={{ p: 3 }}><Typography>Loading geofences...</Typography></Box> : <Box sx={{
        '& .geofence-name-tooltip': {
          backgroundColor: 'rgba(25, 32, 40, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 700,
          padding: '5px 9px',
          whiteSpace: 'nowrap',
        },
        '& .geofence-name-tooltip::before': { display: 'none' },
      }}><MapContainer
        center={center}
        zoom={validGeofences.length === 1 ? 13 : 7}
        style={{ width: '100%', height: 'min(72vh, 760px)', minHeight: 420 }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {validGeofences.map((geofence) => {
          const item = geofence as GeofenceWithNode;
          const visited = wasVisited(item);
          const nestedNode = typeof item.hierarchy_node === 'object' ? item.hierarchy_node?.name : item.hierarchy_node;
          const nodeName = nestedNode || (item.hierarchy_node_id ? nodesById.get(item.hierarchy_node_id) : null) || '—';
          const position: [number, number] = [Number(geofence.latitude), Number(geofence.longitude)];
          const pinIcon = divIcon({
            className: 'geofence-pin-wrapper',
            html: `<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4));"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="${visited ? '#16803c' : '#d32f2f'}" stroke="white" stroke-width="1.5" stroke-linejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7" fill="white" stroke="none"/></svg></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 32],
            tooltipAnchor: [0, 8],
          });
          return <Fragment key={geofence.id}>
            <Marker position={position} icon={pinIcon}>
              <Tooltip permanent direction="bottom" offset={[0, 9]} className="geofence-name-tooltip">
                {geofence.firm_name}
              </Tooltip>
              <Tooltip sticky>
                <strong>{geofence.firm_name}</strong><br />
                Address: {geofence.address || '—'}<br />
                Node: {nodeName}<br />
                Visited: {visited ? 'Yes' : 'No'}
              </Tooltip>
            </Marker>
          </Fragment>;
        })}
      </MapContainer></Box>}
    </Card>
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Typography variant="caption" color="success.main">● Visited</Typography>
      <Typography variant="caption" color="error.main">● Not visited</Typography>
    </Stack>
  </DashboardContent>;
}
