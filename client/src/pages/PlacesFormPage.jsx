import React, { useEffect, useState, useContext } from "react";
import Perks from "./Perks";
import axios from "axios";
import { useParams } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Image from "./Image";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState(1);
  const [checkOut, setCheckOut] = useState(1);
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const { ready, user, setUser, error } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [confDelete, setConfDelete] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/edit/places/" + id)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      })
      .catch((e) => {
        if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
          setErrorMessage("Server not responding, please try again later.");
        } else if (e.message === "Network Error") {
          setErrorMessage("No network connection");
        } else if (e.response.status === 401) {
          setErrorMessage("Access Denied");
        } else if (e.response.status === 404) {
          setErrorMessage("Access Denied");
        } else if (e.response.status === 500) {
          setErrorMessage("Server Error");
        } else {
          setErrorMessage("An error occurred, please try again later");
        }
      });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  // add photo using link
  async function addPhotoLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      })
      .catch((err) => console.log("Error : " + err));
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (confDelete) {
      await axios.delete(`/places/${id}`);
    } else if (id && !confDelete) {
      //updating the place
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      // adding new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  function removePhoto(filename) {
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function selectAsMainPhoto(filename) {
    setAddedPhotos([
      filename,
      ...addedPhotos.filter((photo) => photo !== filename),
    ]);
  }

  if (errorMessage) {
    return (
      <div>
        {errorMessage && (
          <div className="">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative my-4"
              role="alert"
            >
              <strong className="font-bold block">Error!</strong>
              <span className="block sm:inline">{errorMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-8 w-8 bg-red-100 border border-red-400 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  onClick={() => setRedirectLogin(true)}
                >
                  <title>Close</title>
                  <path
                    fillRule="evenodd"
                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
                  />
                </svg>
              </span>
            </div>
          </div>
        )}
        {redirectLogin && <Navigate to={"/login"} />}
      </div>
    );
  }

  if (redirectLogin) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  // redirecting unauthorized users
  if (!ready) {
    return "Loading...";
  }
  // if (error) {
  //   setErrorMessage(error);
  // }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <AccountNavigation />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title for your place. Should be short and catchy.")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely apartment"
        />

        {preInput("Address", "Address to yuor place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />

        {preInput("Photos", "more images always better")}
        <div className="flex gap-3">
          <input
            className="flex-2"
            type="text"
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
            placeholder={"paste image URL"}
          />
          <button
            onClick={addPhotoLink}
            className="flex-1 bg-gray-200 grow px-5 rounded-2xl duration-150 hover:bg-gray-300"
          >
            Add&nbsp;photo
          </button>
        </div>
        <div className="mt-2 gap-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 pb-2">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link) => (
              <div className="h-32 flex relative" key={link}>
                <Image
                  className="rounded-2xl h-32 w-full object-cover"
                  src={link}
                  alt=""
                  style={{ objectPosition: "left center" }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(link)}
                  className="absolute cursor-pointer bottom-2 right-2 text-white bg-primary p-1 rounded-lg opacity-90  duration-200 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>

                {/* Select as the main photo */}
                <button
                  type="button"
                  onClick={() => selectAsMainPhoto(link)}
                  className="absolute cursor-pointer bottom-2 right-12 text-white bg-primary p-1 rounded-lg opacity-90  duration-200 hover:scale-110"
                >
                  {link === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {link !== addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )}
                </button>
                {confDelete && (
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
                                Are you sure you want to delete this place?
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <button
                              onClick={() => setConfDelete(false)}
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-primary_light focus:outline-none focus:border-primary focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                            >
                              No
                            </button>
                            <button
                              onClick={() => (
                                setConfDelete(true), setRedirect(true)
                              )}
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-primary_light focus:outline-none focus:border-primary focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                            >
                              Yes
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          <label className="h-32 cursor-pointer flex items-center justify-center gap-2 border bg-transparent rounded-2xl p-2 text-xl text-gray-600 hover:shadow-md">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
          </label>
        </div>
        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Perks", "Select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-1 md:grid-cols-4 lg:grid-cols-6 ">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra Information", "house rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput(
          "Check in & out times and maximum guests",
          " add check in and out times, remember to have some time window for cleaning the rooms between guests"
        )}
        <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1 ml-1">Check in time</h3>
            <input
              type="number"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 ml-1">Check out time</h3>
            <input
              type="number"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 ml-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
        </div>
        {preInput(
          "Price per night",
          "Always make the prices competitive to get more customers"
        )}
        <div>
          <h3 className="mt-2 -mb-1 ml-1">Price per night</h3>
          <input
            type="number"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>
        <div className="grid gap-2 grid-rows-2 sm:grid-cols-2 mt-5">
          <div className="m-3">
            <button type="submit" className="primary hover:bg-primary_light">
              Save changes
            </button>
          </div>
          <div className="m-3">
            <button
              className="primary hover:bg-red-600"
              onClick={() => (setConfDelete(true), setRedirect(true))}
            >
              Delete place
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
