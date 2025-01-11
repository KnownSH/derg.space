import React from "react";
import * as L from 'leaflet';
import type { AirportData, LocationData, RegionData } from "./types/MapTypes";
import { airportMarker, crateMarker, hiddenAirportMarker, smallAirportMarker } from "./MapIcons";
import type { Params } from "./AeroMap";
import type { defaultLang, ui } from "i18n/ui";

interface AirportMarkerProps {
  airport: AirportData,
  openModal: (content: string) => void,
  closeModal: () => void,
  map: L.Map,
  t: (key: keyof typeof ui[typeof defaultLang]) => string,
}

type LanguageToken = keyof typeof ui[typeof defaultLang];

const basedOnLabel = (basedOn: string, basedOnUrl: string, translation: string) => {
  const label = `
    <tr>
      <td class="infobox-label">${translation}</td>
      <td class="infobox-data"><a href=${basedOnUrl}>${basedOn}</td>
    </tr>
  `;
  return label;
}

const logoLabel = (logo: string, name: string, t: AirportMarkerProps['t'], unofficial?: boolean) => {
  const label = `
    <a href=${logo} class="logo-container">
      <img class="infobox-logo" src=${logo} alt="logo of ${name}${unofficial == true ? " (UNOFFICIAL)" : ""}">
      ${unofficial == true ? `
        <span class="icon-info" title=" ${t("infobox.info")}">INFO:</span>
      ` : ""}
    </a>
  `;
  return label;
};

const formatLocation = (locationData: LocationData, t: AirportMarkerProps['t']) => {
  const { region, subregion, town } = locationData;
  let formattedString = "";

  if (town) {
    formattedString += t(`region.town.${town}` as LanguageToken) + ", ";
  }
  if (subregion) {
    formattedString += t(`region.sr.${subregion}` as LanguageToken) + ", ";
  }

  formattedString += t(`region.r.${region}` as LanguageToken);
  return formattedString;
};

const AirportMarker: React.FC<AirportMarkerProps> = ({ airport, openModal, closeModal, map, t }) => {
  const { marker_icon, coordinates, name, icao, on_click, trello_card, image_url, elevation, runway, runway_length, location } = airport;

  const createInfoBox = (localizedName: string) => {
    const content = `
      <div class="infobox">
        <h2 class="infobox-title">${localizedName}</h2>
        <section id="lightgallery">
          ${airport.logo ? logoLabel(airport.logo, localizedName, t, airport.unofficial_logo) : ""}
          <a href=${image_url}>
            <img class="infobox-image" src="${image_url}" alt="image of ${localizedName} runway">
          </a>
        </section>
        <table class="infobox-table">
          <tbody>
            <tr>
              <th class="infobox-header" colspan="2">${t("infobox.information")}</th>
            </tr>
            <tr>
              <td class="infobox-label">${t("infobox.icao")}</td>
              <td class="infobox-data">${icao}</td>
            </tr>
            <tr>
              <td class="infobox-label">${t("infobox.location")}</td>
              <td class="infobox-data">${formatLocation(location, t)}</td>
            </tr>
            <tr>
              <td class="infobox-label">${t("infobox.elevation")}</td>
              <td class="infobox-data">${(elevation * 3.281).toFixed(0)} ft / ${elevation} m</td>
            </tr>
            ${airport.based_on ? basedOnLabel(airport.based_on, airport.based_on_url as string, t("infobox.based")) : ""}
            <tr>
              <th class="infobox-header" colspan="2">${t("infobox.runway_info")}</th>
            </tr>
            <tr>
              <td class="infobox-label">${t("infobox.runway_num")}</td>
              <td class="infobox-data">${runway}</td>
            </tr>
            <tr>
              <td class="infobox-label">${t("infobox.length")}</td>
              <td class="infobox-data">${(runway_length * 3.281).toFixed(0)} ft / ${runway_length} m</td>
            </tr>
          </tbody>
        </table>
        <br>
        <details>
          <summary>${t("infobox.trello")}</summary>
          <blockquote class="trello-card">
            <a href="${trello_card}">${t("infobox.trello")}</a>
          </blockquote>
        </details>
      </div>
    `;

    return content;
  };

  const localizedName = t(`airport.${name}` as keyof typeof ui[typeof defaultLang]);

  const marker = L.marker(coordinates as L.LatLngExpression, {
    icon: marker_icon == "airport" ? airportMarker : marker_icon == "crate" ? crateMarker : marker_icon == "hidden_airport" ? hiddenAirportMarker : smallAirportMarker
  }).bindPopup(`${localizedName} <b>(${icao})</b>`).addTo(map);

  marker.on('click', (e) => {
    if (on_click?.zoom_in) {
      map.setView(e.latlng, 10);
    }
    if (on_click?.highlight) {
      const polygon = L.polygon(on_click.highlight as L.LatLngExpression[]).addTo(map);
      marker.on('popupclose', () => {
        polygon.removeFrom(map);
      });
    }
    openModal(createInfoBox(localizedName));
  });

  marker.on('popupclose', closeModal);

  return null;
}

export default AirportMarker;