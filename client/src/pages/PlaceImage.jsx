import React from "react";
import axios from "axios";
import Image from "./Image";

export default function PlaceImage({place, index=0, className=null}) {

  if(!place.photos?.length) {
    return '';
  }

  if (!className) {
    className = 'object-cover h-min-10 h-max-48 w-60 rounded-md';
  }

  return (
    <div>
      {place.photos.length > 0 && (
        <Image
          className={className}
          src={place.photos[index]}
          alt={place.photos[0]}
        />
      )}
    </div>
  );
}
