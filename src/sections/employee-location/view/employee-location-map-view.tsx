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
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import {
  useGetEmployeeLocationHistoryQuery,
} from "../../../../redux/service/employeeLocationSlice";


// ----------------------------------------------------------------------
// Employee Location Map
// ----------------------------------------------------------------------

export function EmployeeLocationMapView() {
  const [searchParams] = useSearchParams();

  // URL থেকে employee_id এবং date নেওয়া
  const employeeId =
    searchParams.get("employee_id") || "";

  const date =
    searchParams.get("date") || "";


  console.log("Employee ID:", employeeId);
  console.log("Date:", date);


  // ----------------------------------------------------------------------
  // API
  // ----------------------------------------------------------------------

  const {
    data,
    isLoading,
    error,
  } = useGetEmployeeLocationHistoryQuery({
    employee_id: employeeId,
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


  // প্রথম location map center
  const center = positions[0];


  // ----------------------------------------------------------------------
  // Map
  // ----------------------------------------------------------------------

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{
        width: "100%",
        height: "650px",
      }}
    >

      {/* OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
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


      {/* ------------------------------------------------------------ */}
      {/* Location Markers */}
      {/* ------------------------------------------------------------ */}

      {locations.map((location: any) => {

        const position: [number, number] = [
          Number(location.latitude),
          Number(location.longitude),
        ];


        return (
          <Marker
            key={location.id}
            position={position}
          >
            <Popup>

              <strong>
                Employee Location
              </strong>

              <br />

              Employee ID: {location.employee_id}

              <br />

              Latitude: {location.latitude}

              <br />

              Longitude: {location.longitude}

              <br />

              Time:{" "}
              {new Date(
                location.created_at
              ).toLocaleString()}

            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}