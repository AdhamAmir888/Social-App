/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import { coerce } from "./../../../node_modules/zod/v3/types";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { authContext } from './../../Context/AuthContext';
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const{insertToken}=useContext(authContext);
  type Inputs = {
    email: string;
    password: string;
  };
  const schema = z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character",
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  async function signIn(values: Inputs) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );
      setLoading(false);
      toast.success(data.message);
      insertToken(data.data.token);
      localStorage.setItem("token", data.data.token);
      setLoading(false);
      navigate("/home");
    } catch (e: any) {
      toast.error(e.response.data.message);
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-between min-h-screen bg-[#F0F2F5] pt-5 px-30 gap-10">
      <div className="leftpart w-1/2 pt-30">
        <h1 className="text-6xl font-bold mb-4 text-[#00298D]">Route Posts</h1>

        <p className="text-2xl">
          Connect with friends and the world around you on Route Posts.
        </p>

        <div className="w-full min-h-93 bg-white mt-8 rounded-3xl border-2 border-[#00298D]">
          <div className="p-6">
            <h3 className="text-sm font-bold mb-2 text-[#00298D]">
              ABOUT ROUTE ACADEMY
            </h3>

            <p className="text-lg font-bold">
              Egypt's Leading IT Training Center Since 2012
            </p>

            <p className="text-sm mt-2 text-[#75787e]">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming, web development, and application
              development. We've identified the unique challenges people may
              face when learning new technology and made efforts to provide
              strategies to overcome them.
            </p>

            <div className="smallinfoboxes mt-3">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2">
                    <h3 className="text-lg font-bold text-blue-900">2012</h3>
                    <p className="text-sm font-semibold text-slate-600">
                      FOUNDED
                    </p>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2">
                    <h3 className="text-lg font-bold text-blue-900">40K+</h3>
                    <p className="text-sm font-semibold text-slate-600">
                      GRADUATES
                    </p>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2">
                    <h3 className="text-lg font-bold text-blue-900">50+</h3>
                    <p className="text-[13px] font-semibold text-slate-600">
                      PARTNER COMPANIES
                    </p>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2">
                    <h3 className="text-lg font-bold text-blue-900">5</h3>
                    <p className="text-sm font-semibold text-slate-600">
                      BRANCHES
                    </p>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2">
                    <h3 className="text-lg font-bold text-blue-900">20</h3>
                    <p className="text-[13px] font-semibold text-slate-600">
                      DIPLOMAS AVAILABLE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rightpart w-1/2 pt-20 mt-16 ml-24">
        <div className="w-100 h-auto pb-2.5 bg-white mt-8 rounded-3xl border-2 border-[#00298D] ">
          <div className="rounded-3xl bg-white p-8 ">
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1.5">
              <label
     
                className="flex-1 cursor-pointer rounded-xl py-2.5 text-center text-base font-bold text-slate-600 transition-all duration-200 has-[:checked]:bg-white has-[:checked]:text-blue-900 has-[:checked]:shadow-md"
              >
                <input
                  type="radio"
                  name="entering"
                  value="login"
                  defaultChecked
                  className="sr-only"
                />
                Login
              </label>

              <Link
                to="/"
                className="flex-1 cursor-pointer rounded-xl py-2.5 text-center text-base font-bold text-slate-600 transition-all duration-200 has-[:checked]:bg-white has-[:checked]:text-blue-900 has-[:checked]:shadow-md"
              >
                <input
                  type="radio"
                  name="entering"
                  value="register"
                  className="sr-only"
                />
                Register
              </Link>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 px-6">
            Log in to Route Posts
          </h2>
          <p className="text-[13px]  text-slate-600 px-6 mb-3">
            Log in and continue your social journey.
          </p>

          <form className="px-6" onSubmit={handleSubmit(signIn)}>
            <div className="mb-6">
              <div className="relative">
                <i className="fa-solid fa-at pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="email"
                  id="email"
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full px-3 pl-10 py-2.5  "
                  placeholder="Email address"
                  {...register("email")}
                />
              </div>
              {touchedFields?.email && errors?.email && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="relative">
                <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="password"
                  id="password"
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full px-3 pl-10 py-2.5  "
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              {touchedFields?.password && errors?.password && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-500 w-full rounded-xl box-border  hover:bg-blue-800 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium  text-[18px] px-4 py-2.5 focus:outline-none"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
