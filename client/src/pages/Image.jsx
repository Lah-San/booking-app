import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Image({ src, className }) {
  src = src && src.includes
    ("https://") ? src : "https://raw.githubusercontent.com/Lah-San/booking-app/main/api/" + src;

  return <LazyLoadImage className={className} src={src} alt={""} effect="blur"/>;
}
