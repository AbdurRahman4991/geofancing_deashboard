import { useSearchParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import { latLngBounds } from "leaflet";

import {
  useGetEmployeeLocationHistoryQuery,
} from "../../../../redux/service/employeeLocationSlice";
import type { EmployeeLocationTrackPoint } from "../../../../redux/service/employeeLocationSlice";


// ----------------------------------------------------------------------
// Employee Location Map
// ----------------------------------------------------------------------

function FitMapToLocations({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 1) {
      map.setView(positions[0], 18);
      return;
    }

    map.fitBounds(latLngBounds(positions), {
      padding: [32, 32],
      maxZoom: 20,
    });
  }, [map, positions]);

  return null;
}

export function EmployeeLocationMapView() {
  const [searchParams] = useSearchParams();

  const userId =
    searchParams.get("user_id") || "";

  const date =
    searchParams.get("date") || "";


  // ----------------------------------------------------------------------
  // API
  // ----------------------------------------------------------------------

  const {
    data,
    isLoading,
    error,
  } = useGetEmployeeLocationHistoryQuery({
    user_id: userId,
    date,
  });


  // ----------------------------------------------------------------------
  // Loading
  // ----------------------------------------------------------------------

  if (isLoading) {
    return <div>Loading location...</div>;
  }


  // ----------------------------------------------------------------------
  // Error
  // ----------------------------------------------------------------------

  if (error) {
    return (
      <div>
        Failed to load location history.
      </div>
    );
  }


  // ----------------------------------------------------------------------
  // API Data
  // ----------------------------------------------------------------------

  const segments = data?.segments ?? [];
  const locations = segments.flatMap((segment) => segment.points);


  if (!locations.length) {
    return (
      <div>
        No location found for this employee/date.
      </div>
    );
  }


  // ----------------------------------------------------------------------
  // Polyline positions
  // ----------------------------------------------------------------------

  const toPosition = (location: EmployeeLocationTrackPoint): [number, number] | null => {
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  };

  const positions = locations
    .map(toPosition)
    .filter((position): position is [number, number] => position !== null);
  const segmentPositions = segments
    .map((segment) => segment.points
      .map(toPosition)
      .filter((position): position is [number, number] => position !== null))
    .filter((segment) => segment.length > 0);


  if (!positions.length) {
    return <div>Invalid location data.</div>;
  }


  // à¦ªà§à¦°à¦¥à¦® location map center
  const center = positions[0];


  // ----------------------------------------------------------------------
  // Map
  // ----------------------------------------------------------------------

  return (
    <MapContainer
      center={center}
      zoom={13}
      maxZoom={20}
      style={{
        width: "100%",
        height: "75vh",
        minHeight: "650px",
        borderRadius: "12px",
      }}
    >
      <FitMapToLocations positions={positions} />

      {/* OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        maxNativeZoom={19}
        maxZoom={24}
      />


      {/* ------------------------------------------------------------ */}
      {/* Polyline */}
      {/* ------------------------------------------------------------ */}

      {segmentPositions.map((segment, index) => (
        <Polyline
          key={index}
          positions={segment}
          pathOptions={{ color: "#1976d2", weight: 8, opacity: 0.9 }}
        />
      ))}


    </MapContainer>
  );
}
