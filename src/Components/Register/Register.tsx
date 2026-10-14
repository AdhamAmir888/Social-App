/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const schema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name must be at most 20 characters"),
      username: z
        .string()
        .regex(/^[A-Za-z0-9]+$/, "Username must be alphanumeric")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),
      email: z.email("Invalid email address"),
      gender: z.enum(["male", "female"], "Male or Female only"),
      dateOfBirth: z.coerce.date().refine(function (value) {
        const today = new Date().getFullYear();
        const useryear = value.getFullYear();
        if (today - useryear >= 18) {
          return true;
        }
        return false;
      }),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character",
        ),
      rePassword: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character",
        ),
    })
    .refine(
      function (values) {
        if (values.password === values.rePassword) {
          return true;
        }
        return false;
      },
      { message: "Passwords do not match", path: ["rePassword"] },
    );
    type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;
const {
  register,
  handleSubmit,
  formState: { touchedFields, errors },
} = useForm<FormInput, unknown, FormOutput>({
  defaultValues: {
    name: "",
    username: "",
    email: "",
    dateOfBirth: "",
    password: "",
    rePassword: "",
  },
  resolver: zodResolver(schema),
});

  async function signUp(values: FormOutput) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );
      setLoading(false);
      toast.success(data.message);
      setLoading(false);
      navigate("/login");
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

      <div className="rightpart w-1/2 p-5">
        <div className="w-100 h-auto pb-2.5 bg-white mt-8 rounded-3xl border-2 border-[#00298D] ">
          <div className="rounded-3xl bg-white p-8 ">
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1.5">
              <Link
                to="/login"
                className="flex-1 cursor-pointer rounded-xl py-2.5 text-center text-base font-bold text-slate-600 transition-all duration-200 has-[:checked]:bg-white has-[:checked]:text-blue-900 has-[:checked]:shadow-md"
              >
                <input
                  type="radio"
                  name="entering"
                  value="login"
                  className="sr-only"
                />
                Login
              </Link>

              <label className="flex-1 cursor-pointer rounded-xl py-2.5 text-center text-base font-bold text-slate-600 transition-all duration-200 has-[:checked]:bg-white has-[:checked]:text-blue-900 has-[:checked]:shadow-md">
                <input
                  type="radio"
                  name="entering"
                  value="register"
                  defaultChecked
                  className="sr-only"
                />
                Register
              </label>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 px-6">Create a new account</h2>
          <p className="text-[13px]  text-slate-600 px-6 mb-3">
            It is quick and easy.
          </p>

          <form className="px-6" onSubmit={handleSubmit(signUp)}>
            <div className="mb-5">
              <div className="relative">
                <i className="fa-regular fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>

                <input
                  type="text"
                  id="name"
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full pl-10 pr-3 py-2.5"
                  placeholder="Full Name"
                  {...register("name")}
                />
              </div>

              {touchedFields?.name && errors?.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>

            <div>
              <div className="relative">
                <i className="fa-solid fa-at pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  id="username"
                  className="rounded-xl mb-5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full px-3 pl-10 py-2.5  "
                  placeholder="username(optional)"
                  {...register("username")}
                />
              </div>
              {touchedFields?.username && errors?.username && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.username.message}
                </div>
              )}
            </div>

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
                <i className="	fa-solid fa-user-group pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <select
                  id="gender"
                  defaultValue=""
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full pl-10 pr-3 py-2.5 "
                  {...register("gender")}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {touchedFields?.gender && errors?.gender && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.gender.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <div className="relative">
                <i className="	fa-regular fa-calendar pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full px-3 pl-10 py-2.5  "
                  placeholder="Email address"
                  {...register("dateOfBirth")}
                />
              </div>
              {touchedFields?.dateOfBirth && errors?.dateOfBirth && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.dateOfBirth.message}
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
            <div className="mb-6">
              <div className="relative">
                <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="password"
                  id="rePassword"
                  className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand focus:outline-blue-200 block w-full px-3 pl-10 py-2.5  "
                  placeholder="confirm password"
                  {...register("rePassword")}
                />
              </div>
              {touchedFields?.rePassword && errors?.rePassword && (
                <div className="text-red-500 mt-0 mb-2">
                  {errors.rePassword.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-500 w-full rounded-xl box-border  hover:bg-blue-800 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium  text-[18px] px-4 py-2.5 focus:outline-none"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Creat New Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
