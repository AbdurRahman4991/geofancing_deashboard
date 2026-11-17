import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetUsersQuery } from '../../../redux/service/userSlice';
import { useGetLevelsQuery } from '../../../redux/service/levelSlice';
import { useGetNodesQuery } from '../../../redux/service/nodeSlice';
import type {
  MarketVisitReportPeriod,
  MarketVisitStatus,
} from '../../../redux/service/marketVisitReportService';

export interface ReportFiltersProps {
  date: string;
  period: MarketVisitReportPeriod;
  hierarchyLevelId: string;
  hierarchyNodeId: string;
  userId: string;
  visitStatus: MarketVisitStatus;
  onDateChange: (value: string) => void;
  onPeriodChange: (value: MarketVisitReportPeriod) => void;
  onHierarchyLevelChange: (value: string) => void;
  onHierarchyNodeChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onVisitStatusChange: (value: MarketVisitStatus) => void;
  onFilterChange?: () => void;
  showDate?: boolean;
  showPeriod?: boolean;
  showHierarchy?: boolean;
  showEmployee?: boolean;
  showVisitStatus?: boolean;
  dateLabel?: string;
  idPrefix?: string;
}

export function ReportFilters({
  date,
  period,
  hierarchyLevelId,
  hierarchyNodeId,
  userId,
  visitStatus,
  onDateChange,
  onPeriodChange,
  onHierarchyLevelChange,
  onHierarchyNodeChange,
  onUserChange,
  onVisitStatusChange,
  onFilterChange,
  showDate = true,
  showPeriod = true,
  showHierarchy = true,
  showEmployee = true,
  showVisitStatus = true,
  dateLabel = 'Report date',
  idPrefix = 'report',
}: ReportFiltersProps) {
  const companyId = getCurrentCompanyId();
  const { data: levelsResponse, isLoading: levelsLoading } = useGetLevelsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId || !showHierarchy }
  );
  const { data: nodesResponse, isLoading: nodesLoading } = useGetNodesQuery(
    {
      company_id: companyId,
      hierarchy_level_id: Number(hierarchyLevelId),
      page: 1,
      per_page: 100,
    },
    { skip: !companyId || !showHierarchy || !hierarchyLevelId }
  );
  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery(
    { page: 1, per_page: 100 },
    { skip: !showEmployee }
  );
  const levels = levelsResponse?.data.data ?? [];
  const nodes = nodesResponse?.data.data ?? [];
  const users = (usersResponse?.data ?? []).filter(
    (user) =>
      !companyId || String(user.company_id ?? user.employee?.company_id) === String(companyId)
  );

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      spacing={2}
      useFlexGap
      flexWrap="wrap"
    >
      {showPeriod && (
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id={`${idPrefix}-period-label`}>Period</InputLabel>
          <Select
            labelId={`${idPrefix}-period-label`}
            value={period}
            label="Period"
            onChange={(event) => {
              onPeriodChange(event.target.value as MarketVisitReportPeriod);
              onFilterChange?.();
            }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      )}
      {showDate && (
        <TextField
          label={dateLabel}
          type="date"
          value={date}
          onChange={(event) => {
            onDateChange(event.target.value);
            onFilterChange?.();
          }}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      )}
      {showHierarchy && (
        <>
          <FormControl size="small" sx={{ minWidth: 170 }} disabled={!companyId || levelsLoading}>
            <InputLabel id={`${idPrefix}-hierarchy-level-label`}>Hierarchy level</InputLabel>
            <Select
              labelId={`${idPrefix}-hierarchy-level-label`}
              value={hierarchyLevelId}
              label="Hierarchy level"
              onChange={(event) => {
                onHierarchyLevelChange(event.target.value);
                onHierarchyNodeChange('');
                onFilterChange?.();
              }}
            >
              <MenuItem value="">All levels</MenuItem>
              {levels.map((level) => (
                <MenuItem key={level.id} value={String(level.id)}>
                  {level.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{ minWidth: 170 }}
            disabled={!hierarchyLevelId || nodesLoading}
          >
            <InputLabel id={`${idPrefix}-hierarchy-node-label`}>Hierarchy node</InputLabel>
            <Select
              labelId={`${idPrefix}-hierarchy-node-label`}
              value={hierarchyNodeId}
              label="Hierarchy node"
              onChange={(event) => {
                onHierarchyNodeChange(event.target.value);
                onFilterChange?.();
              }}
            >
              <MenuItem value="">All nodes</MenuItem>
              {nodes.map((node) => (
                <MenuItem key={node.id} value={String(node.id)}>
                  {node.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {showEmployee && (
        <FormControl size="small" sx={{ minWidth: 190 }} disabled={usersLoading}>
          <InputLabel id={`${idPrefix}-employee-label`}>Employee</InputLabel>
          <Select
            labelId={`${idPrefix}-employee-label`}
            value={userId}
            label="Employee"
            onChange={(event) => {
              onUserChange(event.target.value);
              onFilterChange?.();
            }}
          >
            <MenuItem value="">All employees</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={String(user.id)}>
                {user.employee?.name ?? user.name ?? `User #${user.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {showVisitStatus && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id={`${idPrefix}-visit-status-label`}>Visit status</InputLabel>
          <Select
            labelId={`${idPrefix}-visit-status-label`}
            value={visitStatus}
            label="Visit status"
            onChange={(event) => {
              onVisitStatusChange(event.target.value as MarketVisitStatus);
              onFilterChange?.();
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="visited">Visited</MenuItem>
            <MenuItem value="not_visited">Not visited</MenuItem>
          </Select>
        </FormControl>
      )}
    </Stack>
  );
}
