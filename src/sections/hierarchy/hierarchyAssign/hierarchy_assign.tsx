import { useState } from 'react';

import {
  Card,
  Stack,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast, ToastContainer } from 'react-toastify';

// ============================================================
// User
// ============================================================

import {
  useGetAssignRoleUsersQuery,
} from '../../../../redux/service/userSlice';

// ============================================================
// Hierarchy APIs
// ============================================================

import {
  useGetCountriesQuery,
} from '../../../../redux/service/countrySlice';

import {
  useGetRegionsQuery,
} from '../../../../redux/service/regionSlice';

import {
  useGetZonesQuery,
} from '../../../../redux/service/zoneSlice';

import {
  useGetDivisionsQuery,
} from '../../../../redux/service/divisionSlice';

import {
  useGetDistrictsQuery,
} from '../../../../redux/service/districtSlice';

import {
  useGetSubDistrictsQuery,
} from '../../../../redux/service/subDistrictSlice';

import {
  useGetTerritoriesQuery,
} from '../../../../redux/service/territorySlice';

import {
  useGetAreasQuery,
} from '../../../../redux/service/areaSlice';

// ============================================================
// Assignment Mutation
// ============================================================

import {
  useAssignUserMutation,
} from '../../../../redux/service/employeeHierarchyAssignmentSlice';

// ============================================================

export default function EmployeeHierarchyAssignmentView() {

  // ==========================================================
  // Selected Values
  // ==========================================================

  const [userId, setUserId] =
    useState<number | ''>('');

  const [countryId, setCountryId] =
    useState<number | ''>('');

  const [regionId, setRegionId] =
    useState<number | ''>('');

  const [zoneId, setZoneId] =
    useState<number | ''>('');

  const [divisionId, setDivisionId] =
    useState<number | ''>('');

  const [districtId, setDistrictId] =
    useState<number | ''>('');

  const [subDistrictId, setSubDistrictId] =
    useState<number | ''>('');

  const [territoryId, setTerritoryId] =
    useState<number | ''>('');

  const [areaId, setAreaId] =
    useState<number | ''>('');

  const [effectiveFrom, setEffectiveFrom] =
    useState('');

  const [reason, setReason] =
    useState('');

  // ==========================================================
  // Users
  // ==========================================================

  const {
    data: userData,
    isLoading: userLoading,
  } = useGetAssignRoleUsersQuery({
    page: 1,
    per_page: 100,
    search: '',
  });

  const users =
    userData?.data?.data ?? [];

  // ==========================================================
  // Countries
  // ==========================================================

const {
  data: countryData,
  isLoading: countryLoading,
} = useGetCountriesQuery();

const countries = countryData?.data ?? [];


  // ==========================================================
  // Regions
  // ==========================================================

  const {
    data: regionData,
    isLoading: regionLoading,
  } = useGetRegionsQuery();

  const regions = regionData?.data ?? [];

  // ==========================================================
  // Zones
  // ==========================================================

  const {
    data: zoneData,
    isLoading: zoneLoading,
  } = useGetZonesQuery({
    page: 1,
    per_page: 100,
    search: '',
    region_id:
      regionId || undefined,
  });

  const zones =
    zoneData?.data?.data ?? [];

  // ==========================================================
  // Divisions
  // ==========================================================

  const {
    data: divisionData,
    isLoading: divisionLoading,
  } = useGetDivisionsQuery({
    page: 1,
    per_page: 100,
    search: '',
    zone_id:
      zoneId || undefined,
  });

  const divisions =
    divisionData?.data?.data ?? [];

  // ==========================================================
  // Districts
  // ==========================================================

  const {
    data: districtData,
    isLoading: districtLoading,
  } = useGetDistrictsQuery({
    page: 1,
    per_page: 100,
    search: '',
    division_id:
      divisionId || undefined,
  });

  const districts =
    districtData?.data?.data ?? [];

  // ==========================================================
  // Sub Districts
  // ==========================================================

  const {
    data: subDistrictData,
    isLoading: subDistrictLoading,
  } = useGetSubDistrictsQuery({
    page: 1,
    per_page: 100,
    search: '',
    district_id:
      districtId || undefined,
  });

  const subDistricts =
    subDistrictData?.data?.data ?? [];

  // ==========================================================
  // Territories
  // ==========================================================

  const {
    data: territoryData,
    isLoading: territoryLoading,
  } = useGetTerritoriesQuery({
    page: 1,
    per_page: 100,
    search: '',
    sub_district_id:
      subDistrictId || undefined,
  });

  const territories =
    territoryData?.data?.data ?? [];

// ==========================================================
// Areas
// ==========================================================

const {
  data: areaData,
  isLoading: areaLoading,
} = useGetAreasQuery({
  page: 1,
  per_page: 100,
  search: '',
  territory_id: territoryId || undefined,
});

const areas = areaData?.data ?? [];




  // ==========================================================
  // Assignment Mutation
  // ==========================================================

  const [
    assignUser,
    { isLoading: assigning },
  ] = useAssignUserMutation();

  // ==========================================================
  // Country Change
  // ==========================================================

  const handleCountryChange = (
    value: number | ''
  ) => {

    setCountryId(value);

    setRegionId('');
    setZoneId('');
    setDivisionId('');
    setDistrictId('');
    setSubDistrictId('');
    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // Region Change
  // ==========================================================

  const handleRegionChange = (
    value: number | ''
  ) => {

    setRegionId(value);

    setZoneId('');
    setDivisionId('');
    setDistrictId('');
    setSubDistrictId('');
    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // Zone Change
  // ==========================================================

  const handleZoneChange = (
    value: number | ''
  ) => {

    setZoneId(value);

    setDivisionId('');
    setDistrictId('');
    setSubDistrictId('');
    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // Division Change
  // ==========================================================

  const handleDivisionChange = (
    value: number | ''
  ) => {

    setDivisionId(value);

    setDistrictId('');
    setSubDistrictId('');
    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // District Change
  // ==========================================================

  const handleDistrictChange = (
    value: number | ''
  ) => {

    setDistrictId(value);

    setSubDistrictId('');
    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // Sub District Change
  // ==========================================================

  const handleSubDistrictChange = (
    value: number | ''
  ) => {

    setSubDistrictId(value);

    setTerritoryId('');
    setAreaId('');
  };

  // ==========================================================
  // Territory Change
  // ==========================================================

  const handleTerritoryChange = (
    value: number | ''
  ) => {

    setTerritoryId(value);

    setAreaId('');
  };

  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit = async () => {

    if (!userId) {
      toast.error('Please select employee');
      return;
    }

    if (!countryId) {
      toast.error('Please select country');
      return;
    }

    if (!regionId) {
      toast.error('Please select region');
      return;
    }

    if (!zoneId) {
      toast.error('Please select zone');
      return;
    }

    if (!divisionId) {
      toast.error('Please select division');
      return;
    }

    if (!districtId) {
      toast.error('Please select district');
      return;
    }

    if (!subDistrictId) {
      toast.error('Please select sub district');
      return;
    }

    if (!territoryId) {
      toast.error('Please select territory');
      return;
    }

    if (!areaId) {
      toast.error('Please select area');
      return;
    }

    if (!effectiveFrom) {
      toast.error('Please select effective date');
      return;
    }

    try {

      await assignUser({
        user_id: userId,
        country_id: countryId,
        region_id: regionId,
        zone_id: zoneId,
        division_id: divisionId,
        district_id: districtId,
        sub_district_id: subDistrictId,
        territory_id: territoryId,
        area_id: areaId,
        effective_from: effectiveFrom,
        reason: reason,
      }).unwrap();

      toast.success(
        'Employee hierarchy assigned successfully'
      );

      // Reset

      setUserId('');
      setCountryId('');
      setRegionId('');
      setZoneId('');
      setDivisionId('');
      setDistrictId('');
      setSubDistrictId('');
      setTerritoryId('');
      setAreaId('');
      setEffectiveFrom('');
      setReason('');

    } catch (error: any) {

      toast.error(
        error?.data?.message ||
        'Hierarchy assignment failed'
      );
    }
  };

  // ==========================================================
  // Loading
  // ==========================================================

  const hierarchyLoading =
    userLoading ||
    countryLoading;

  // ==========================================================
  // UI
  // ==========================================================

  if (hierarchyLoading) {

    return (
      <DashboardContent>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>

      {/* ==================================================== */}
      {/* Page Header */}
      {/* ==================================================== */}

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Employee Hierarchy Assignment
      </Typography>

      {/* ==================================================== */}
      {/* Main Card */}
      {/* ==================================================== */}

      <Card
        sx={{
          p: 4,
          maxWidth: 900,
        }}
      >

        <Stack spacing={3}>

          {/* ================================================= */}
          {/* Employee */}
          {/* ================================================= */}

          <FormControl fullWidth>
            <InputLabel>
              Employee
            </InputLabel>

            <Select
              value={userId}
              label="Employee"
              onChange={(e) =>
                setUserId(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Employee
              </MenuItem>

              {users.map((user: any) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                >
                  {user.employee?.name ?? '-'}
                  {' '}
                  (
                  {user.employee?.employee_id ??
                    user.employee_id ??
                    user.id}
                  )
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Typography
            variant="h6"
          >
            Hierarchy Location
          </Typography>

          {/* ================================================= */}
          {/* Country */}
          {/* ================================================= */}

          <FormControl fullWidth>
            <InputLabel>
              Country
            </InputLabel>

            <Select
              value={countryId}
              label="Country"
              onChange={(e) =>
                handleCountryChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Country
              </MenuItem>

              {countries.map((country: any) => (
                <MenuItem
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Region */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!countryId}
          >
            <InputLabel>
              Region
            </InputLabel>

            <Select
              value={regionId}
              label="Region"
              onChange={(e) =>
                handleRegionChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Region
              </MenuItem>

              {regions.map((region: any) => (
                <MenuItem
                  key={region.id}
                  value={region.id}
                >
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Zone */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!regionId}
          >
            <InputLabel>
              Zone
            </InputLabel>

            <Select
              value={zoneId}
              label="Zone"
              onChange={(e) =>
                handleZoneChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Zone
              </MenuItem>

              {zones.map((zone: any) => (
                <MenuItem
                  key={zone.id}
                  value={zone.id}
                >
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Division */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!zoneId}
          >
            <InputLabel>
              Division
            </InputLabel>

            <Select
              value={divisionId}
              label="Division"
              onChange={(e) =>
                handleDivisionChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Division
              </MenuItem>

              {divisions.map((division: any) => (
                <MenuItem
                  key={division.id}
                  value={division.id}
                >
                  {division.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* District */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!divisionId}
          >
            <InputLabel>
              District
            </InputLabel>

            <Select
              value={districtId}
              label="District"
              onChange={(e) =>
                handleDistrictChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select District
              </MenuItem>

              {districts.map((district: any) => (
                <MenuItem
                  key={district.id}
                  value={district.id}
                >
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Sub District */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!districtId}
          >
            <InputLabel>
              Sub District
            </InputLabel>

            <Select
              value={subDistrictId}
              label="Sub District"
              onChange={(e) =>
                handleSubDistrictChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Sub District
              </MenuItem>

              {subDistricts.map(
                (subDistrict: any) => (
                  <MenuItem
                    key={subDistrict.id}
                    value={subDistrict.id}
                  >
                    {subDistrict.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Territory */}
          {/* ================================================= */}

          <FormControl
            fullWidth
            disabled={!subDistrictId}
          >
            <InputLabel>
              Territory
            </InputLabel>

            <Select
              value={territoryId}
              label="Territory"
              onChange={(e) =>
                handleTerritoryChange(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                Select Territory
              </MenuItem>

              {territories.map(
                (territory: any) => (
                  <MenuItem
                    key={territory.id}
                    value={territory.id}
                  >
                    {territory.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* ================================================= */}
          {/* Area */}
          {/* ================================================= */}

          <FormControl
  fullWidth
  disabled={!territoryId}
>
  <InputLabel>
    Area
  </InputLabel>

  <Select
    value={areaId}
    label="Area"
    onChange={(e) =>
      setAreaId(
        e.target.value === ''
          ? ''
          : Number(e.target.value)
      )
    }
  >
    <MenuItem value="">
      Select Area
    </MenuItem>

    {areas.map((area) => (
      <MenuItem
        key={area.id}
        value={area.id}
      >
        {area.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>



          <Divider />

          <Typography
            variant="h6"
          >
            Assignment Details
          </Typography>

          {/* ================================================= */}
          {/* Effective From */}
          {/* ================================================= */}

          <TextField
            fullWidth
            label="Effective From"
            type="date"
            value={effectiveFrom}
            onChange={(e) =>
              setEffectiveFrom(
                e.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          {/* ================================================= */}
          {/* Reason */}
          {/* ================================================= */}

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason"
            placeholder="Enter reason for assignment or transfer"
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
          />

          {/* ================================================= */}
          {/* Submit */}
          {/* ================================================= */}

          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleSubmit}
            disabled={assigning}
          >
            {assigning
              ? 'Assigning...'
              : 'Assign Employee'}
          </Button>

        </Stack>

      </Card>

      <ToastContainer />

    </DashboardContent>
  );
}