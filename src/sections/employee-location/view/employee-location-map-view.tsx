// import { useParams } from "react-router";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// import {useGetEmployeeLocationQuery} from "../../../../redux/service/employeeLocationSlice"


// export  function EmployeeLocationMapView() {
//     // const { id } = useParams();

//     // const { data, isLoading } = useGetEmployeeLocationQuery(id);
//     const { id } = useParams();
//     const { data, isLoading, error } = useGetEmployeeLocationQuery(id);

//     console.log("ID:", id);
//     console.log("Data:", data);
//     console.log("Error:", error);

//     if (isLoading) return <>Loading...</>;

//     const location = data;

//     if (!location) return <>Location not found</>;

//     const position = [
//         Number(location.latitude),
//         Number(location.longitude),
//     ];

//     <Popup>
//         <strong>{location.employee?.name}</strong>
//         <br />
//         Code: {location.employee?.employee_id}
//     </Popup>

//     return (
//         <MapContainer
//             center={position}
//             zoom={17}
//             style={{
//                 width: "100%",
//                 height: "650px",
//             }}
//         >
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             <Marker position={position}>
//                 <Popup>
//                     <b>{location.employee.name}</b>

//                     <br />

//                     Code : {location.employee.employee_id}

//                     <br />

//                     Latitude : {location.latitude}

//                     <br />

//                     Longitude : {location.longitude}
//                 </Popup>
//             </Marker>
//         </MapContainer>
//     );
// }
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
      maxZoom: 18,
    });
  }, [map, positions]);

  return null;
}

export function EmployeeLocationMapView() {
  const [searchParams] = useSearchParams();

  // URL à¦¥à§‡à¦•à§‡ employee_id à¦à¦¬à¦‚ date à¦¨à§‡à¦“à§Ÿà¦¾
  const userId =
    searchParams.get("user_id") || "";

  const date =
    searchParams.get("date") || "";


  console.log("User ID:", userId);
  console.log("Date:", date);


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


  console.log("Location History:", data);
  console.log("Error:", error);


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

  const locations = data?.data ?? [];


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

  const positions: [number, number][] =
    locations
      .map((location: any) => [
        Number(location.latitude),
        Number(location.longitude),
      ])
      .filter(
        ([lat, lng]: [number, number]) =>
          !Number.isNaN(lat) &&
          !Number.isNaN(lng)
      );


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
      maxZoom={24}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        minHeight: "500px",
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

      <Polyline
        positions={positions}
        pathOptions={{
          color: "blue",
          weight: 5,
          opacity: 0.8,
        }}
      />


    </MapContainer>
  );
}
