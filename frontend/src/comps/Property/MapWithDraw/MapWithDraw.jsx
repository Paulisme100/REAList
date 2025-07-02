import React, { useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Listing from "../Listing/ListingPreview";

const ListingsLayer = ({ listings }) => {
  return (
    <>
      {listings.map((listing) => (
        <Marker key={listing.id} position={[listing.coordX, listing.coordY]}>
          <Popup>
            <strong>{listing.title}</strong>
            <br />
            {listing.address}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const MapWithDraw = () => {
  const [shapes, setShapes] = useState([]); // { id, geometry }
  const [listings, setListings] = useState([]);

  const fetchListingsWithinShape = async (geoJson) => {
    try {
      const res = await fetch(`${SERVER_URL}/listings/by-shape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ polygon: geoJson }),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      return [];
    }
  };

  const refreshListings = async (allShapes) => {
    let combined = [];

    for (const shape of allShapes) {
      const data = await fetchListingsWithinShape(shape.geometry);
      combined = [...combined, ...data];
    }

    const unique = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );

    setListings(unique);
  };

  const handleCreated = async (e) => {
    const layer = e.layer;
    const id = layer._leaflet_id;
    const geometry = layer.toGeoJSON().geometry;

    const updated = [...shapes, { id, geometry }];
    setShapes(updated);
    refreshListings(updated);
  };

  const handleEdited = async (e) => {
    const updated = [...shapes];

    e.layers.eachLayer((layer) => {
      const id = layer._leaflet_id;
      const geometry = layer.toGeoJSON().geometry;

      const index = updated.findIndex((s) => s.id === id);
      if (index !== -1) {
        updated[index] = { id, geometry };
      }
    });

    setShapes(updated);
    refreshListings(updated);
  };

  const handleDeleted = async (e) => {
    const deletedIds = [];
    e.layers.eachLayer((layer) => {
      deletedIds.push(layer._leaflet_id);
    });

    const remaining = shapes.filter((shape) => !deletedIds.includes(shape.id));
    setShapes(remaining);
    refreshListings(remaining);
  };

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

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
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
