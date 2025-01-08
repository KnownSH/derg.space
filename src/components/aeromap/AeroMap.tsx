import React, { useEffect, useState } from "react";
import * as L from "leaflet";
import ClarenceIsland from "../../assets/clarencehires.png";

const AeroMapConfig = {
  crs: L.CRS.Simple,
  minZoom: -4,
  initialView: {
    latLng: [5213.910462, 4705.59375] as L.LatLngExpression,
    zoom: 1,
  },
  bounds: [[0, 0], [10000, 10000]] as L.LatLngBoundsExpression,
};

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
    }).setView(AeroMapConfig.initialView.latLng, AeroMapConfig.initialView.zoom);
    
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
    
    var bounds: L.LatLngBoundsExpression = [[0, 0], [10000, 10000]];
    var image = L.imageOverlay('/Aeromap.png', bounds).addTo(map);
    
    var undyana = L.imageOverlay('/Udyanapuraplaceholder.png', [[3050, 2326], [3798, 3035]]).addTo(map);
    var clarence = L.imageOverlay(ClarenceIsland.src, [[4940, 5151], [5150, 5303]]).addTo(map);
    
    var islandbounds: L.LatLngBoundsExpression = [[5202, 4685], [5225, 4727]];
    var island = L.imageOverlay('/mappage.png', islandbounds).addTo(map);
    
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
      [5214.084987, 4693.384766],
      [5213.766707, 4693.226563],
      [5209.083177, 4702.509766],
      [5209.383358, 4702.663086],
    ]);
    
    var marker = L.marker([5211.5, 4698], {icon: airportMarker}).bindPopup("Webley Island Airfield <b>(MUWI)</b>").addTo(map);

    var marker2 = L.marker([5028.161341, 5279.5625], {icon: airportMarker}).addTo(map);
    var marker3 = L.marker([5121.304985, 5273.046875], {icon: smallairportMarker}).addTo(map);
    
    marker.on('click', (e) => {
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
    
    L.marker([5214.75, 4707.28], {icon: crateMarker}).addTo(webleyIslandCrates)
      .bindPopup(`<img style="width: 20rem" src="/aeromap-assets/webley-island/crateloc1.jpg"></img>`, {closeButton: false});
    L.marker([5222.721857, 4719.473633], {icon: crateMarker}).addTo(webleyIslandCrates)
      .bindPopup(`<img style="width: 20rem" src="/aeromap-assets/webley-island/crateloc2.jpg"></img>`, {closeButton: false});
    L.marker([5214.47656, 4718.759766], {icon: crateMarker}).addTo(webleyIslandCrates)
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
      if (map.getZoom() < 3) {
        map.removeLayer(webleyIslandCrates);
        airportMarker.options.iconSize = [26/2, 38/2];
        airportMarker.options.iconAnchor = [(26/2)/2, 38/2],
        marker.setIcon(airportMarker);
      } else {
        map.addLayer(webleyIslandCrates);
        airportMarker.options.iconSize = [26, 38];
        airportMarker.options.iconAnchor = [26/2, 38],
        marker.setIcon(airportMarker);
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