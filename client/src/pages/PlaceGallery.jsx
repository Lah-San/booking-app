import { useState } from "react";
import React from "react";
import axios from "axios";
import Image from "./Image";

export default function PlaceGallery({ data }) {
  const [showPhotos, setShowPhotos] = useState(false);

  if (showPhotos) {
    return (
      <div className="absolute inset-0  bg-opacity-50 text-white h-full z-50">
        <div className="p-8 grid gap-4 bg-black bg-opacity-95">
          <h2 className="text-3xl">{data.title}</h2>
          {showPhotos && data.photos[0] && (
            <div className="relative p-2 sm:p-5 md:p-10 lg:p-32">
              {data.photos.map((photo, index) => (
                <div className="">
                  <Image
                    className=" rounded-2xl w-full right-0 mb-5 "
                    key={index}
                    src={photo}
                    alt={`Photo ${index}`}
                  />
                </div>
              ))}
              <button
                onClick={() => setShowPhotos(!showPhotos)}
                className="fixed bottom-4 right-4 text-white font-semibold bg-primary rounded-md px-10 py-2 shadow-lg duration-100 hover:shadow-xl hover:bg-red-600 m-2"
              >
                Close viewer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="gap-2 grid grid-cols-[2fr_1fr] rounded-lg overflow-hidden">
        <div className="">
          {data.photos?.[0] && (
            <div className="aspect-square sm:aspect-video md:aspect-video lg:aspect-video object-cover">
              <div>
                <Image
                  className="aspect-square sm:aspect-video md:aspect-video lg:aspect-video  object-cover "
                  src={data.photos[0]}
                  alt={data.photos[0]}
                />
              </div>
            </div>
          )}
        </div>
        <div className="">
          {data.photos?.[1] && (
            <Image
              className="aspect-square sm:aspect-video md:aspect-video lg:aspect-video object-cover"
              src={data.photos[1]}
              alt=""
            />
          )}
          <div className="overflow-hidden  relative">
            {data.photos?.[2] && (
              <Image
                className="aspect-square sm:aspect-video md:aspect-video lg:aspect-video object-cover  relative top-2"
                src={data.photos[2]}
                alt=""
              />
            )}
            <button
              onClick={() => setShowPhotos(true)}
              className="absolute flex gap-1 rounded-full bottom-2 right-2 lg:bottom-2 lg:right-2 xl:right-6 py-2 px-2 border-black bg-white shadow-md shadow-gray-700 duration-100 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="hidden md:block lg:block">Show more photos</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
