import React from "react";

import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import PetsIcon from "@mui/icons-material/Pets";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import TvIcon from "@mui/icons-material/Tv";

export default function Perks({ selected, onChange }) {
  function handleCbCkick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedname) => selectedname !== name)]);
    }
  }

  return (
    <>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("wifi")}
          name="wifi"
          onChange={handleCbCkick}
        />
        <NetworkWifiIcon />
        <span>Wifi</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("parking")}
          name="parking"
          onChange={handleCbCkick}
        />
        <LocalParkingIcon />
        <span>Free parking space</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("first-aid")}
          name="first-aid"
          onChange={handleCbCkick}
        />
        <MedicalServicesIcon />
        <span>First aid kit</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("fire-extinguisher")}
          name="fire-extinguisher"
          onChange={handleCbCkick}
        />
        <FireExtinguisherIcon />
        <span>Fire extinguisher</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("pets")}
          name="pets"
          onChange={handleCbCkick}
        />
        <PetsIcon />
        <span>Pets</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("stay")}
          name="stay"
          onChange={handleCbCkick}
        />
        <EventAvailableIcon />
        <span>Long term stay</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={selected.includes("washer")}
          name="washer"
          onChange={handleCbCkick}
        />
        <LocalLaundryServiceIcon />
        <span>Washer</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer mb-3">
        <input type="checkbox" checked={selected.includes("tv")} name="tv"  onChange={handleCbCkick} />
        <TvIcon />
        <span>TV</span>
      </label>
    </>
  );
}
