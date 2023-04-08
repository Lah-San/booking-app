import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget";
import PlaceGallery from "./PlaceGallery";
import AddressLink from "./AddressLink";

export default function ViewPlace() {
  const { id } = useParams();

  const [extraInfoActive, setExtraInfo] = useState(false);
  const [descriptionActive, setDescription] = useState(false);

  const [place, setPlace] = useState([]);

  useEffect(() => {
    if (!id) {
    } else {
      axios.get("/places/" + id).then((response) => {
        setPlace([response.data]);
      });
    }
  }, [id]);

  if (!place || !place.length) {
    return null;
  }

  return (
    <div className="">
      <div className="bg-gray-200 p-4 rounded-2xl my-5">
        {place.map((data) => (
          <div key={data._id}>
            <h2 className="mt-1 font-bold text-2xl mb-2">{data.title}</h2>

            <AddressLink>{data.address}</AddressLink>

            <PlaceGallery data={data} />

            <div className="mt-4 gap-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] text-lg sm:text-sm">
              <div className="">
                <div className="p-2 m-1 min-h-36 max-h-96 truncate overflow-hidden bg-white rounded-2xl duration-100 hover:shadow-lg relative bg-gradient-to-t from-neutral-100 from-1%  to-transparent to-90%">
                  <h2 className="font-bold text-gray-00 text-xl my-4">
                    Description
                  </h2>
                  <p className="whitespace-pre-line leading-6">
                    {data.description}
                  </p>
                  <div className="">
                    <button
                      onClick={() => setDescription(true)}
                      className="absolute bottom-5 right-16 rounded-xl bg-gradient-to-b from-gray-300 to-gray-100 font-semi bold shadow-md text-sm sm:text-md  px-5 py-2"
                    >
                      Read more
                    </button>
                  </div>
                </div>
                {data.extraInfo.length > 0 && (
                  <div className="p-2 m-1 min-h-36 max-h-96 truncate overflow-hidden bg-white rounded-2xl duration-100 hover:shadow-lg relative bg-gradient-to-t from-neutral-100 from-1%  to-transparent to-90% mt-5">
                    <h2 className="font-bold text-gray-00 text-xl text-gray-800 mt-10">
                      Extra Information
                    </h2>
                    <p className="whitespace-pre-line text-gray-700 ">
                      {data.extraInfo}
                    </p>
                    <div className="">
                      <button
                        onClick={() => setExtraInfo(true)}
                        className="absolute bottom-5 right-16 rounded-xl bg-gradient-to-b from-gray-300 to-gray-100 font-semi bold shadow-md text-sm sm:text-md  px-5 py-2"
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                )}

                <div className="ml-2 "></div>
              </div>
              <div className="bg-white shadow p-4 rounded-2xl hover:shadow-xl max-h-fmax">
                <div className="text-2xl mb-4 text-center">
                  Price: ${data.price} / per night
                </div>

                <BookingWidget place={data} />

                <div className="p-2 m-1 my-2 truncate overflow-hidden bg-white rounded-2xl text-sm">
                  <div className="mb-4 text-center text-md p-1 border-b border-black">
                    <span className="font-semibold">Booking details</span>
                  </div>
                  <div className="my-2 p-2 border-b">
                    <label>Check in:</label>
                    <span className="ml-2">{data.checkIn}</span>
                  </div>
                  <div className="my-2 p-2 border-b">
                    <label>Check out:</label>
                    <span className="ml-2">{data.checkOut}</span>
                  </div>
                  <div className="my-2 p-2">
                    <label>Max number of guests:</label>
                    <span className="ml-2">{data.maxGuests}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {place.map((data) => (
        <div className="w-full" key={data._id}>
          {descriptionActive && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Description
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm sm:text-md leading-5 text-gray-500 sm:text-black whitespace-pre-line">
                            {data.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                      <button
                        onClick={() => setDescription(false)}
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-primary_light focus:outline-none focus:border-primary focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                      >
                        Close
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {extraInfoActive && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Extra Information
                          </h3>
                          <div className="mt-2">
                          <p className="text-sm sm:text-md leading-5 text-gray-500 sm:text-black whitespace-pre-line">
                            {data.extraInfo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                      <button
                        onClick={() => setExtraInfo(false)}
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-primary_light focus:outline-none focus:border-primary focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                      >
                        Close
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
