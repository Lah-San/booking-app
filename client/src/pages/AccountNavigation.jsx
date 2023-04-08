import {
  Link,
  useLocation,
} from "react-router-dom";

import React from "react";

export default function AccountNavigation() {
  const { pathname } = useLocation();

  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClasses(type = null) {
    const isActive = pathname === "/account" && type === "profile";
    let classes = "inline-flex gap-2 py-2 px-6 rounded-full duration-150";
    // if (type === subpage || (subpage === undefined && type === "profile")) {
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += "bg-gray-200";
    }
    return classes;
  }

  return (
    <div className="">
      <nav className="w-full justify-center flex mt-8 gap-4 mb-8 pb-3 border-b">
        <div className="bg-gray-200 rounded-full">
          <Link className={linkClasses("profile")} to={"/account"}>
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <label className="hidden sm:flex md:flex lg:flex">Profile</label>
          </Link>
        </div>
        <div className="bg-gray-200 rounded-full">
          <Link className={linkClasses("bookings")} to={"/account/bookings"}>
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
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <label className="hidden sm:flex md:flex lg:flex">
              Bookings
            </label>
          </Link>
        </div>
        <div className="bg-gray-200 rounded-full">
          <Link className={linkClasses("places")} to={"/account/places"}>
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
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
            <label className="hidden sm:flex md:flex lg:flex">
              Accommodations
            </label>
          </Link>
        </div>
      </nav>
    </div>
  );
}
