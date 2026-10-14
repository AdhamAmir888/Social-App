import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function getMyData() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { data: myData } = useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
  });

  return (
    <header className="h-19 border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00298D] text-[10px] font-extrabold text-white">
            ROUTE
          </div>
          <span className="text-xl font-bold text-slate-900">Route Posts</span>
        </div>

        <nav className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            <i className="fa-solid fa-house text-lg"></i>
            Feed
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            <i className="fa-regular fa-user text-lg"></i>
            Profile
          </NavLink>

          <span
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-400 opacity-60"
          >
            <i className="fa-regular fa-comment text-lg"></i>
            Notifications
          </span>
        </nav>

        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              {myData?.data.data.user.photo ? (
                <img
                  src={myData?.data.data.user.photo}
                  alt={myData?.data.data.user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <i className="fa-regular fa-user text-lg"></i>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {myData?.data.data.user.name}
            </span>
            <i className="fa-solid fa-bars text-slate-500"></i>
          </div>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <i className="fa-regular fa-user w-4 text-center"></i>
                Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/setting");
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <i className="fa-solid fa-gear w-4 text-center"></i>
                Settings
              </button>

              <div className="my-1 border-t border-slate-200"></div>

              <button
                onClick={() => {
                  setOpen(false);
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
