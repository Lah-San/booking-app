import { Link } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImage from "./PlaceImage";
// MUI icons
export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      axios.get("/user-places").then(({ data }) => {
        setPlaces(data);
      });
    } catch(e) {
      if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
        setError("Server not responding, please try again later.");
      } else if (e.message === "Network Error") {
        setError("No network connection");
      } else if (e.response.status === 401) {
        setError("Access Denied");
      } else if (e.response.status === 404) {
        setNotFound("No Places Found");
      } else if (e.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred, please try again later");
      }
    }
  }, []);

  return (
    <div>
      {notFound &&(
        <div className="text-md sm:text-lg text-center font-semibold mt-10 sm:m-15">
          {notFound}
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
      <AccountNavigation />
      <div className="text-center">
        <Link
          className=" inline-flex bg-primary text-white gap-1 py-2 px-6 rounded-full"
          to={"/account/places/new"}
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add a new place
        </Link>
      </div>
      <div className="mt-4 ">
        {places.length > 0 &&
          places.map((place) => {
            return (
              <div key={place._id} className="mb-4 rounded-2xl hover:shadow-md">
                <Link
                  className="flex cursor-pointer gap-4 border bg-gray-100 p-4 rounded-2xl duration-150 hover:shadow-sm"
                  to={"/account/places/" + place._id}
                >
                  <div className="flex grow shrink-0">
                    <PlaceImage place={place} />
                  </div>
                  <div className="w-200 whitespace-nowrap overflow-hidden text-ellipsis">
                    <h2 className="text-xl">{place.title}</h2>
                    <div className="">
                      <p className="text-md mt-2 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 inline-flex align-middle"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                        {place.address}
                      </p>
                    </div>

                    <h3 className="text-sm text-stone-400 mt-3">Description</h3>
                    <p className="text-sm truncate">{place.description}</p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}
