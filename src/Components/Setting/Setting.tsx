/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const Settings = () => {
  type Inputs = {
    password: string;
    newPassword: string;
    rePassword: string;
  };

  const schema = z
    .object({
      password: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character",
        ),
      rePassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine(
      function (values) {
        if (values.newPassword === values.rePassword) {
          return true;
        }
        return false;
      },
      { message: "Passwords do not match", path: ["rePassword"] },
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { touchedFields, errors },
  } = useForm<Inputs>({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
  });

  function changePassword(values: Inputs) {
    return axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      {
        password: values.password,
        newPassword: values.newPassword,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: ({ data }) => {
      const newToken = data?.data?.token
  
        localStorage.setItem("token", newToken);
      
      toast.success(data.message);
      reset();
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
    },
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <i className="fa-solid fa-key text-lg"></i>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Change Password
            </h1>
            <p className="text-sm text-slate-500">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit((values) => mutate(values))}
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Current password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-blue-200"
              {...register("password")}
            />
            {touchedFields?.password && errors?.password && (
              <div className="mt-1 text-red-500">{errors.password.message}</div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              New password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-blue-200"
              {...register("newPassword")}
            />
            <p className="mt-2 text-xs text-slate-500">
              At least 8 characters with uppercase, lowercase, number, and
              special character.
            </p>
            {touchedFields?.newPassword && errors?.newPassword && (
              <div className="mt-1 text-red-500">
                {errors.newPassword.message}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Confirm new password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-blue-200"
              {...register("rePassword")}
            />
            {touchedFields?.rePassword && errors?.rePassword && (
              <div className="mt-1 text-red-500">
                {errors.rePassword.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer rounded-xl bg-blue-500 py-3.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isPending ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;