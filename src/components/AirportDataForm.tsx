import Form from "@rjsf/core";
import type { RJSFSchema } from "@rjsf/utils";
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  title: "Generate a airport JSON file",
  description: "This is currently very hacky, once your JSON file is generated, just DM or ping me with it. Not all entries are required and can be skipped if you don't know what to put in.",
  required: [
    "icao",
    "name",
    "location",
    "coordinates",
    "marker_icon",
  ],
  properties: {
    icao: {
      type: "string",
      title: "ICAO Airport Code",
      description: "This is the short 3/4 letter code on most airports in Aeronuatica",
    },
    name: {
      type: "string",
      title: "Airport Name",
      description: "The full airport name, capitalized properly. (i.e. Webley Island Airfield)"
    },
    location: {
      type: "string",
      title: "Airport Location",
      description: "The airports location, formatted properly. (i.e. Webley Island, Central Oconia)"
    },
    elevation: {
      type: "number",
      title: "Airport Elevation (in meters)",
      description: "Go to the Aeronautica ATC website and find the number on a airport chart, convert it to meters, or land at the airport ingame and record that number."
    },
    runway: {
      type: "string",
      title: "Runway Numbers",
      description: "Format it like so: \"10/30\" or if theres multiple runways, split them with commas."
    },
    runway_length: {
      type: "number",
      title: "Runway Length (in meters)",
      description: "Also get this one from IRL or Aeronautica airport charts or just measure it ingame if your decent with math."
    },
    coordinates: {
      type: "array",
      title: "Coordinates",
      description: "Get these numbers from Aeronautimap, click on where the airport is (you decide where the best location to put the marker is), then copy the numbers given",
      items: [
        {
          title: "Latitude",
          type: "number",
          default: 0,
        },
        {
          title: "Longitude",
          type: "number",
          default: 0,
        }
      ],
    },
    marker_icon: {
      title: "Airport Icon",
      description: "Look at the Aeronautica map ingame, is the airport your submitting have a blue icon, green icon, or no icon at all?",
      enumNames: [
        "Blue Icon Airport",
        "Green Icon Airport",
        "Hidden Airport",
      ],
      enum: [
        "airport",
        "small_airport",
        "hidden_airport",
      ],
    },
    trello_card: {
      title: "Trello Card URL",
      description: `Go to Encyclopedia Aeronautica and find the airport you want to add. Click the share button on the right, and copy the text under "Link to this card"`,
      type: "string",
    },
    image_url: {
      title: "Airport Screenshot",
      description: "Take a really damn good screenshot of the airport, just send the discord image link, or send it somewhere in the Aeronautica discord and provide the message link",
      type: "string",
    },
  }
};

const submit = ({ formData }: any, e: any) => {
  document.body.appendChild(document.createElement('pre')).innerHTML = "Copy and paste the below, in discord embed it with the ```json codeblock";
  document.body.appendChild(document.createElement('pre')).innerHTML = JSON.stringify(formData, null, 2);
};

const AirportDataForm = () => {
  return (
    <Form 
      schema={schema} 
      validator={validator} 
      onSubmit={submit}
    />
  )
}

export default AirportDataForm;