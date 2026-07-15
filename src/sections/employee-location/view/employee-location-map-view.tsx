import { useParams } from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import {useGetEmployeeLocationQuery} from "../../../../redux/service/employeeLocationSlice"


export  function EmployeeLocationMapView() {
    // const { id } = useParams();

    // const { data, isLoading } = useGetEmployeeLocationQuery(id);
    const { id } = useParams();
    const { data, isLoading, error } = useGetEmployeeLocationQuery(id);

    console.log("ID:", id);
    console.log("Data:", data);
    console.log("Error:", error);

    if (isLoading) return <>Loading...</>;

    const location = data;

    if (!location) return <>Location not found</>;

    const position = [
        Number(location.latitude),
        Number(location.longitude),
    ];

    <Popup>
        <strong>{location.employee?.name}</strong>
        <br />
        Code: {location.employee?.employee_id}
    </Popup>

    return (
        <MapContainer
            center={position}
            zoom={17}
            style={{
                width: "100%",
                height: "650px",
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    <b>{location.employee.name}</b>

                    <br />

                    Code : {location.employee.employee_id}

                    <br />

                    Latitude : {location.latitude}

                    <br />

                    Longitude : {location.longitude}
                </Popup>
            </Marker>
        </MapContainer>
    );
}