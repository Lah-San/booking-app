import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Image({ src, ...rest }) {
  src = src && src.includes
    ("https://") ? src : "https://raw.githubusercontent.com/Lah-San/booking-app/main/api/" + src;

  return <img {...rest} src={src} alt={""} effect="blur"/>;
}
