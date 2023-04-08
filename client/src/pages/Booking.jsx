import axios from "axios";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import AddressLink from "./AddressLink";
import PlaceGallery from "./PlaceGallery";
import AccountNavigation from "./AccountNavigation";
import BookingDates from "./BookingDates";
import { differenceInCalendarDays, format } from "date-fns";
import { Navigate } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [popup, setPopup] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get("/bookings")
        .then((response) => {
          const foundBooking = response.data.find(({ _id }) => _id === id);
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError("Booking not found");
          }
        })
        .catch((e) => {
          if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
            setError("Server not responding, please try again later.");
          } else if (e.message === "Network Error") {
            setError("No network connection");
          } else if (e.response.status === 401) {
            setError("Access Denied");
          } else if (e.response.status === 404) {
            setError("Access Denied");
          } else if (e.response.status === 500) {
            setError("Server Error");
          } else {
            setError("An error occurred, please try again later");
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (cancel) {
      axios
        .delete(`/bookings/delete/${id}`)
        .then(() => {
          setPopup(false);
          setRedirect(true);
        })
        .catch((e) => {
          if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
            setError("Server not responding, please try again later.");
          } else if (e.message === "Network Error") {
            setError("No network connection");
          } else if (e.response.status === 401) {
            setError("Access Denied");
          } else if (e.response.status === 404) {
            setError("Access Denied");
          } else if (e.response.status === 500) {
            setError("Server Error");
          } else {
            setError("An error occurred, please try again later");
          }
        });
    }
  }, [cancel, id]);

  if (popup) {
    return (
      <div className="">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-4">
              Are you sure you want to cancel this booking?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setPopup(false)}
              >
                No
              </button>
              <button
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={() => (setCancel(true), setRedirect(true))}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
        {redirect && <Navigate to={"/account/bookings"} />}
      </div>
    );
  }

  if (!booking) {
    return "";
  }

  console.log(error);
  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative my-4"
        role="alert"
      >
        <strong className="font-bold block">Error!</strong>
        <span className="block sm:inline">{error}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            className="fill-current h-8 w-8 bg-red-100 border border-red-400 text-red-500"
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
    );
  }

  return (
    <div className="">
      <AccountNavigation />
      <div className="mt-8">
        <h2 className="mt-1 font-bold text-2xl mb-2">{booking.place.title}</h2>
        <AddressLink>{booking.place.address}</AddressLink>
        <div className="bg-gray-200 p-4 rounded-2xl">
          <h2 className="text-xl">Your booking information:</h2>
          <BookingDates booking={booking} />
          <PlaceGallery data={booking.place} />
          <div className="mt-3 flex gap-2">
            <div className="flex row gap-2 txt-lg text-gray-800 mt-3 text-lg">
              Nights :{" "}
              {differenceInCalendarDays(
                new Date(booking.checkOut),
                new Date(booking.checkIn)
              )}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
              | Total Price : ${booking.price}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path
                  fillRule="evenodd"
                  d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                  clipRule="evenodd"
                />
              </svg>
              | Guests : {booking.numberOfGuests}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setPopup(true)}
              className="my-4 p-3 px-20 text-white font-semibold bg-primary rounded-2xl duration-100 hover:shadow-xl"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

