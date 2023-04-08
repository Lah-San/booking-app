import { Difference } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = Math.abs(
      differenceInCalendarDays(new Date(checkIn), new Date(checkOut))
    );
  }

  async function bookingThisPlace() {
    const response = await axios
      .post("/bookings", {
        place: place._id,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price: numberOfNights * place.price,
      })
      .catch((err) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">
                Something went wrong
              </h2>
            </div>
          </div>
        );
      });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="border rounded-2xl my-4">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] text-center lg:text-left">
          <div className="my-4 p-2 border-b lg:border-r lg:border-b-0">
            <label className="block mb-2">Check in:</label>
            <input
              className="appearance-none bg-transparent border-b-2 border-gray-500 w-full py-2 px-4 leading-tight focus:outline-none focus:border-indigo-500"
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>

          <div className="my-4 p-2">
            <label className="block mb-2">Check out:</label>
            <input
              className="appearance-none bg-transparent border-b-2 border-gray-500 w-full py-2 px-4 leading-tight focus:outline-none focus:border-indigo-500"
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="">
        <div className="py-3 px-4 border-t">
          <div className="">
            <label className="block mb-2">Number of guests:</label>
            <input
              className="appearance-none bg-transparent border-b-2 border-gray-500 w-full py-2 px-4 leading-tight focus:outline-none focus:border-indigo-500"
              type="number"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="">
              <label className="block my-2">Your full name:</label>
              <input
                className="appearance-none bg-transparent border-b-2 border-gray-500 w-full py-2 px-4 leading-tight focus:outline-none focus:border-indigo-500"
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <label className="block my-2">Your phone number:</label>
              <input
                className="appearance-none bg-transparent border-b-2 border-gray-500 w-full py-2 px-4 leading-tight focus:outline-none focus:border-indigo-500"
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          )}
          <button
            onClick={bookingThisPlace}
            className="primary duration-100 hover:bg-primary_light my-4"
          >
            Book this place&nbsp;
            {numberOfNights > 0 && (
              <span>for&nbsp;${numberOfNights * place.price}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
