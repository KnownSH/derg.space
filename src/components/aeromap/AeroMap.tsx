import React, { useEffect, useState } from "react";
import * as L from "leaflet";

const AeroMapConfig = {
  crs: L.CRS.EPSG3857,
  minZoom: 1,
  initialView: {
    latLng: [0, 0] as L.LatLngExpression,
    zoom: 1,
  },
  bounds: [[0, 0], [10000, 10000]] as L.LatLngBoundsExpression,
}; // not being used lol

const loadTrelloEmbed = () => {
  if (!document.querySelector('script[src="https://p.trellocdn.com/embed.min.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://p.trellocdn.com/embed.min.js';
    script.async = true;
    document.body.appendChild(script);
  }

  const checkTrelloCards = () => {
    if (window.TrelloCards) {
      window.TrelloCards.load();
    } else {
      setTimeout(checkTrelloCards, 250);
    }
  };
  checkTrelloCards();
};

const AeroMap = () => {
  
  const [mapar, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    const map = L.map('map', {
      crs: AeroMapConfig.crs,
      minZoom: AeroMapConfig.minZoom,
      zoomSnap: 0,
      zoomDelta: 0.25,
      layers: [
        new L.TileLayer("/aeromap-assets/full_map_tiles/{z}/{x}/{y}.jpg", {
          maxNativeZoom: 7, 
          maxZoom: 11, 
          minZoom: 1, 
          noWrap: true,
          bounds: [[85.020879, -179.67041], [-84.92382, 178.066406]],
          attribution: "2025. Assets by Aeronautica Developers",
        }),
        new L.TileLayer("/aeromap-assets/clarence_island_tiles/{z}/{x}/{y}.jpg", {
          maxNativeZoom: 11, 
          maxZoom: 15, 
          minZoom: 8, 
          noWrap: true, 
          bounds: [[5.257627, 5.415454], [-2.036203, 10.83252]],
        }),
        new L.TileLayer("/aeromap-assets/webley_island_tiles/{z}/{x}/{y}.png", {
          maxNativeZoom: 11, 
          maxZoom: 15, 
          minZoom: 8, 
          noWrap: true, 
          bounds: [[8.008968, -11.164856], [7.373445, -9.901428]],
        }),
      ]
    }).setView([0, 0], 2);
      //85.020879, -179.67041 -84.92382, 178.066406
    
    
    var modal = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    
    function openModal(content: string) {
      if (modalContent != null && modal != null) {
        modalContent.innerHTML = content;
        modal.classList.add("open");
        loadTrelloEmbed();
      }
    }
    
    function closeModal() {
      if (modal == null) { return null };
      modal.classList.remove("open");
    }
    
    let orangeMarker = L.icon({
      iconUrl: '/map-marker-orange.png',
      iconSize: [25/1.5, 38/1.5],
      iconAnchor: [12.5/1.5, 38/1.5]
    });
    
    let crateMarker = L.icon({
      iconUrl: "/aeromap-assets/crate-marker.png",
      iconSize: [26/1.5, 38/1.5],
      iconAnchor: [(26/2)/1.5, 38/1.5],
      popupAnchor: [0, -38/1.5],
    });
    
    let airportMarker = L.icon({
      iconUrl: "/aeromap-assets/airport-marker.png",
      iconSize: [26, 38],
      iconAnchor: [26/2, 38],
      popupAnchor: [0, -38],
    });

    let smallairportMarker = L.icon({
      iconUrl: "/aeromap-assets/small-airport-marker.png",
      iconSize: [23, 34],
      iconAnchor: [23/2, 34],
      popupAnchor: [0, -34],
    });
    
    let webleypoly = L.polygon([
      [7.678528, -10.950621],
      [7.689357, -10.94529],
      [7.536294, -10.645368],
      [7.52626, -10.649758],
    ]);
    
    var marker = L.marker([7.589975, -10.749435], {icon: smallairportMarker}).bindPopup("Webley Island Airfield <b>(MUWI)</b>").addTo(map);

    var marker2 = L.marker([0.975115, 10.023651], {icon: airportMarker}).addTo(map);
    var marker3 = L.marker([4.223242, 9.788818], {icon: smallairportMarker}).addTo(map);
    
    marker.on('click', (e) => {
      map.setView(e.latlng, 10);
      openModal(`
        <div class="infobox">
          <h2 class="infobox-title">Webley Island Airfield</h2>
          <img class="infobox-image" src="/Webley_Island.png" alt="image of webley island runway">
          <table class="infobox-table">
            <tbody>
              <tr>
                <th class="infobox-header" colspan="2">General Information</th>
              </tr>
              <tr>
                <td class="infobox-label">ICAO Code</td>
                <td class="infobox-data">MUWI</td>
              </tr>
              <tr>
                <td class="infobox-label">Location</td>
                <td class="infobox-data">Webley Island, Central Oconia</td>
              </tr>
              <tr>
                <td class="infobox-label">Elevation</td>
                <td class="infobox-data">148 ft / 45 m</td>
              </tr>
              <tr>
                <th class="infobox-header" colspan="2">Runway Information</th>
              </tr>
              <tr>
                <td class="infobox-label">Runway</td>
                <td class="infobox-data">12/30</td>
              </tr>
              <tr>
                <td class="infobox-label">Length</td>
                <td class="infobox-data">2,100 ft / 640 m</td>
              </tr>
            </tbody>
          </table>
          <blockquote class="trello-card">
            <a href="https://trello.com/c/Nvjfrc9i">Trello Card</a>
          </blockquote>
        </div>
      `);
      webleypoly.addTo(map);
    });
    
    marker.on('popupclose', (e) => {
      webleypoly.removeFrom(map);
    })
    
    let webleyIslandCrates = new L.FeatureGroup();
    
    L.marker([7.710332, -10.491943], {icon: crateMarker}).addTo(webleyIslandCrates)
      .bindPopup(`<img style="width: 20rem" src="/aeromap-assets/webley-island/crateloc1.jpg"></img>`, {closeButton: false});
    L.marker([7.969496, -10.0978093], {icon: crateMarker}).addTo(webleyIslandCrates)
      .bindPopup(`<img style="width: 20rem" src="/aeromap-assets/webley-island/crateloc2.jpg"></img>`, {closeButton: false});
    L.marker([7.702528, -10.119438], {icon: crateMarker}).addTo(webleyIslandCrates)
      .bindPopup(`<a><img style="width: 20rem" id="lightgallery" src="/aeromap-assets/webley-island/crateloc3.jpg"></img></a>`, {closeButton: false});
    
    var clickpopup = L.popup()
    
    function onMapClick(e) {
      if (modal != null && !modal.contains(e.originalEvent.target) && modal.classList.contains("open")) {
        closeModal();
      }
      
      clickpopup
          .setLatLng(e.latlng)
          .setContent(e.latlng.toString())
          .openOn(map);
    }
    
    function onMapZoomEnd(e) {
      if (map.getZoom() < 6) {
        map.removeLayer(webleyIslandCrates);
      } else {
        map.addLayer(webleyIslandCrates);
      }
    }
    
    map.on('zoomend', onMapZoomEnd);
    map.on('click', onMapClick);
  })
  
  return (
    <>
      <div id="map">
        <div id="modal">
          <div id="modal-content"></div>
        </div>
      </div>
    </>
  )
};

export default AeroMap;