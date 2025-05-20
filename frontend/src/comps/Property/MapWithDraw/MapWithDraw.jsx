import React, { useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
  Popup
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L, { geoJSON } from "leaflet";
import Listing from "../Listing/ListingPreview";

const ListingsLayer = ({ listings }) => {
  // const map = useMap();

  // listings.forEach((listing) => {
  //   const marker = L.marker([listing.coordX, listing.coordY])
  //     .bindPopup(`<b>${listing.title}</b><br>${listing.address}`);
  //   marker.addTo(map);
  // });

  // return null;

  return (
    <>
      {listings.map((listing) => (
        <Marker key={listing.id} position={[listing.coordX, listing.coordY]}>
          <Popup>
            <strong>{listing.title}</strong><br />
            {listing.address}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const MapWithDraw = () => {
  const [listings, setListings] = useState([]);

  const fetchListingsWithinShape = async(geoJson) => {
    try {
        const res = await fetch(`${SERVER_URL}/listings/by-shape`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ polygon: geoJson })
        });

        return await res.json()

    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }

  }

  const handleCreated = async (e) => {
    const geoJson = e.layer.toGeoJSON().geometry;

    const data = await fetchListingsWithinShape(geoJson);
    setListings(data);
    
  };

  const handleEdited = async(e) => {

    const layers = e.layers
    let firstLayer = null
    layers.eachLayer(layer => {
      firstLayer = layer
    })

    if(firstLayer) {
      const geoJson = firstLayer.toGeoJSON().geometry

      const data = await fetchListingsWithinShape(geoJson);

      setListings(data)
    }
  }

  const handleDeleted = async(e) => {
    setListings([])
  }

  return (
    <div>
      <MapContainer
        center={[44.4268, 26.1025]}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: true,
            }}
          />
        </FeatureGroup>

        <ListingsLayer listings={listings} />
      </MapContainer>

      <div style={{ marginTop: "20px" }}>
        {listings.length ? (
          listings.map((listing) => (
           <Listing key={listing.id} listing={listing} />
          ))
        ) : (
          <p>Draw an area to see listings inside it.</p>
        )}
      </div>
    </div>
  );
};

export default MapWithDraw;
