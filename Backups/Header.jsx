import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import IndexPage from "./IndexPage";

function Header() {
  const { user } = useContext(UserContext);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  //const [title, setTitle] = useState("");
  //const [date, setDate] = useState("");
  const [maxGuests, setMaxGuests] = useState();
  const [SearchResults, setSearchResults] = useState(""); 

  if (!UserContext) {
    return <Navigate to={"/login"} />;
  }

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  async function handleSearch(ev) {
    ev.preventDefault();

    console.log(title);
    console.log(maxGuests);

    try {
      const searchData = {
        title,
        maxGuests,
      };

      const response = await axios.get("/search", { data: searchData });
      then(setSearchResults(response.data));
    } catch (e) {
      // if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
      //   setError("Server not responding, please try again later.");
      // } else if (e.message === "Network Error") {
      //   setError("No network connection");
      // } else if (e.response.status === 401) {
      //   setError("Access Denied");
      // } else if (e.response.status === 500) {
      //   setError("Server Error");
      // } else if (e.response.status === 404) {
      //   setError("Coundn't find any places");
      // } else {
      //   setError("An error occurred, please try again later");
      // }
    }
  }

  console.log(SearchResults);

  console.log(SearchResults.length);
  if (SearchResults.length > 0) {
    return (
      <div className="mt-8 grid gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {SearchResults.length > 0 &&
          SearchResults.map((place) => (
            <Link
              to={"/places/" + place._id}
              key={place._id}
              className="border p-3 rounded-2xl duration-75 hover:shadow-lg "
            >
              <div className="bg-gray-500 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={axios.defaults.baseURL + "/" + place.photos?.[0]}
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
    );
  }

  return (
    <div>
      <header className="flex justify-between gap-1">
        <Link to={"/"} href="" className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 -rotate-90 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          <span className="hidden md:flex lg:flex  font-bold text-xl">
            AirBnC
          </span>
        </Link>
        <button
          onClick={toggleOverlay}
          className="flex gap-3 border bg-opacity-20 border-gray-300 rounded-full py-2 px-4 duration-150 shadow hover:shadow-md shadow-gray-250"
        >
          <div className="hidden sm:flex md:flex lg:flex  font-semibold">
            Anywhere
          </div>
          <div className="hidden sm:flex md:flex lg:flex  border-l border-gray-300"></div>
          <div className="hidden sm:flex md:flex lg:flex  font-semibold">
            Any week
          </div>
          <div className="hidden sm:flex md:flex lg:flex  border-l border-gray-300"></div>
          <div className="hidden sm:flex md:flex lg:flex  font-md">
            Add guests
          </div>
          <div className="pr-3 sm:hidden md:hidden lg:hidden font-md">
            Search
          </div>
          <div className="bg-primary text-white p-1.5 text-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </button>
        {isOverlayOpen && (
          <div className="">
            <div
              onClick={() => setIsOverlayOpen(false)}
              className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-25"
            ></div>
            <div className="fixed z-50 top-0 left-0 w-full">
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-b-3xl px-4 md:px-24 py-6 flex-col text-center sm:mx-16"
              >
                <div className="sm:flex rounded-lg gap-2">
                  <input
                    type="text"
                    name="title"
                    className="caret-primary border border-gray-300 rounded-lg pl-1 sm:px-4 py-4 w-full mb-1"
                    placeholder="Search Place..."
                  />
                  <div className=" bg-gray-200 flex py-2 px-3 gap-1  align-middle rounded-full">
                    <input
                      type="date"
                      className="caret-primary border border-gray-300 rounded-3xl p-3 sm:px-4 py-1 w-full mb-1 text-sm sm:text-md"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="max-w-12 max-h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>

                    <input
                      type="date"
                      className="border border-gray-300 rounded-3xl p-3 sm:px-4 py-1 w-full mb-1 text-sm sm:text-md "
                    />
                  </div>
                  <input
                    type="number"
                    name="maxGuests"
                    className="caret-primary border border-gray-300 rounded-3xl p-3 sm:px-4 py-1 w-full mb-1 text-sm sm:text-md"
                    placeholder="Max Guests"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white rounded-full px-20 md:px-40 py-2 mt-4 hover:bg-primary_light"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
        <Link
          to={user ? "/account" : "/login"}
          className="flex border items-center md:gap-4 border-gray-300 rounded-full py-2 px-2 sm:px-4 duration-150 hover:shadow-md "
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div
            to={"/login"}
            className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 relative top-1 hidden sm:flex"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!!user && (
            <div className="hidden sm:flex md:flex lg:flex ">{user.name}</div>
          )}
        </Link>
      </header>
    </div>
  );
}

export default Header;
