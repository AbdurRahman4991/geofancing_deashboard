import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { DashboardContent } from "src/layouts/dashboard";
import { useGetUsersQuery } from "../../redux/service/userSlice";
import { useLazyGetLatestEmployeeLocationQuery } from "../../redux/service/employeeLocationSlice";

export default function EmployeeLiveLocationView() {
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [message, setMessage] = useState("");

  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery({
    page: 1,
    per_page: 100,
    search: employeeSearch,
  });
  const [fetchLatestLocation, { isFetching }] = useLazyGetLatestEmployeeLocationQuery();
  const employees = usersResponse?.data ?? [];

  const handleShowLocation = async () => {
    if (!selectedEmployee?.id) return;

    setLocation(null);
    setMessage("");
    try {
      const response = await fetchLatestLocation({
        user_id: selectedEmployee.id,
        refreshKey: Date.now(),
      }).unwrap();
      const latest = response?.data?.[0];
      if (!latest) {
        setMessage("এই employee-এর কোনো location পাওয়া যায়নি।");
        return;
      }
      setLocation(latest);
    } catch {
      setMessage("সর্বশেষ location load করা যায়নি।");
    }
  };

  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  const validLocation = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <DashboardContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Employee Live Location</Typography>
      </Box>

      <Card sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 2 }}>
          <Autocomplete
            sx={{ minWidth: 280, flex: 1 }}
            options={employees}
            value={selectedEmployee}
            loading={usersLoading}
            onInputChange={(_, value) => setEmployeeSearch(value)}
            onChange={(_, value) => {
              setSelectedEmployee(value);
              setLocation(null);
              setMessage("");
            }}
            getOptionLabel={(option) =>
              `${option.employee?.name ?? option.name ?? "Unnamed user"} (${option.employee?.employee_id ?? option.employee_id ?? "No ID"})`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Select employee" />}
          />
          <Button
            variant="contained"
            disabled={!selectedEmployee?.id || isFetching}
            onClick={handleShowLocation}
          >
            {isFetching ? "Loading..." : "Show Live Location"}
          </Button>
        </Box>

        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

        {location && validLocation && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              সর্বশেষ update: {new Date(location.created_at).toLocaleString()}
            </Typography>
            <MapContainer
              center={[latitude, longitude]}
              zoom={17}
              style={{ width: "100%", height: 650 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[latitude, longitude]}>
                <Popup>
                  {selectedEmployee.employee?.name ?? selectedEmployee.name}
                  <br />
                  Latitude: {location.latitude}
                  <br />
                  Longitude: {location.longitude}
                  <br />
                  Updated: {new Date(location.created_at).toLocaleString()}
                </Popup>
              </Marker>
            </MapContainer>
          </>
        )}
        {location && !validLocation && <Alert severity="error">Location coordinates invalid.</Alert>}
      </Card>
    </DashboardContent>
  );
}
