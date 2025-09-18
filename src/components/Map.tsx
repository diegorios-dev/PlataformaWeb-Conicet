import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


const Map = ({position}: any) => {
    return (
     <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}>

        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>📍 Estoy en Buenos Aires</Popup>
        </Marker>

      </MapContainer>
    )
}

export default Map