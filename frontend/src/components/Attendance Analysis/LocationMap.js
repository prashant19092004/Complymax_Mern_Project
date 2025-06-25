import React from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationMap.css";
import L from "leaflet";

// Fix default icon issue
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const locationData = {
  officeCenter: [28.6139, 77.2090], // Example: New Delhi
  radius: 300, // meters
  checkIns: [
    {
      name: "Aarav Sharma",
      position: [28.6145, 77.2085],
      status: "Inside Geofence",
    },
    {
      name: "Simran Kaur",
      position: [28.6100, 77.2065],
      status: "Outside Geofence",
    },
  ],
};

const LocationMap = () => {
  const { officeCenter, radius, checkIns } = locationData;

  return (
    <div className="map-section">
      <h3>Employee Check-In Locations</h3>
      <MapContainer
        center={officeCenter}
        zoom={15}
        scrollWheelZoom={false}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={officeCenter} radius={radius} pathOptions={{ fillColor: "#3b82f6", fillOpacity: 0.2, color: "#3b82f6" }} />
        {checkIns.map((user, index) => (
          <Marker
            key={index}
            position={user.position}
            icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
          >
            <Popup>
              <strong>{user.name}</strong>
              <br />
              {user.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
