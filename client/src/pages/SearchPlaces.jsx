import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Image from "./Image";

export default function SearchPlaces() {

  const [title, setTitle] = useState("");
  const [maxGuests, setmaxGuests] = useState(""); 

  const location = useLocation();
  
  useEffect(() => { 
    const searchParams = new URLSearchParams(location.search);
    setTitle(searchParams.get('title'));
    setmaxGuests(searchParams.get('maxGuests'));
    console.log(`Title: ${title}, Max Guests: ${maxGuests}`);
  }, [location.search]);
  
  const [error, setErrorMessage] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [places, setSearchPlaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchData = {
          title,
          maxGuests,
        };
        const { data } = await axios.get("/search", { params: searchData });
        setSearchPlaces(data);
        setError(false);
      } catch (e) {
          if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
            setErrorMessage("Server not responding, please try again later.");
          } else if (e.message === "Network Error") {
            setErrorMessage("No network connection");
          } else if (e.response.status === 401) {
            setErrorMessage("Access Denied");
          } else if (e.response.status === 404) {
            setNotFound("Access Denied");
          } else if (e.response.status === 500) {
            setErrorMessage("Server Error");
          } else {
            setErrorMessage("An error occurred, please try again later");
          };
      }
    };

    fetchData();
  }, [title, maxGuests]);

  return (
    <div className="">
      {notFound &&(
        <div className="text-md sm:text-lg text-center font-semibold mt-10 sm:m-15">
          No search results found
        </div>
      )
      }
      {error && !notFound &&(
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative my-4"
          role="alert"
        >
          <strong className="font-bold block">Error!</strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-8 w-8 bg-red-200 rounded-lg border border-red-400 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => setError(false)}
            >
              <title>Close</title>
              <path
                fillRule="evenodd"
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              />
            </svg>
          </span>
        </div>
      )}
      <div className="mt-8 grid gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/places/" + place._id}
              key={place._id}
              className="border p-3 rounded-2xl duration-75 hover:shadow-lg "
            >
              <div className="bg-gray-500 rounded-2xl flex">
                {place.photos?.[0] && (
                  <Image
                    className="rounded-2xl object-cover aspect-square"
                    src={place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold text-lg==md mt-2">{place.title}</h2>
              <h3 className="text-sm text-gray-600 truncate">
                {place.address}
              </h3>
              <p className="text-sm text-gray-600">
                {place.checkIn} - {place.checkOut}
              </p>
              <div className="flex align-baseline gap-1">
                <h4 className="from-neutral-700 font-medium">${place.price}</h4>
                <h4>per night</h4>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
