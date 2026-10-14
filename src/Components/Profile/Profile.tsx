import axios from "axios";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";import PostCard from "../PostCard/PostCard";
import type { Post } from "../../Interface/PostInterface";
import toast from "react-hot-toast";
const Profile = () => {
  // which tab is open
  const [tab, setTab] = useState<"myPosts" | "saved">("myPosts");

  // my profile info
  function getMyData() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { data: myData, isLoading: loadingUser } = useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
  });

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const user = myData?.data.data.user;
  const allPosts: Post[] = postsData?.data.data.posts ?? [];

  const myPosts = allPosts.filter((post) => post.user._id === user?._id);
  const savedPosts = allPosts.filter((post) => post.bookmarked);

  const postsToShow = tab === "myPosts" ? myPosts : savedPosts;
  const queryClient = useQueryClient();
  const photoRef = useRef<HTMLInputElement>(null);

  function uploadPhoto(formData: FormData) {
    return axios.put(
      "https://route-posts.routemisr.com/users/upload-photo",
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  const { mutate: photoMutate, isPending: isUploading } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      toast.success("Profile photo updated");
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    },
  });

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    photoMutate(formData);
    e.target.value = "";
  }
  if (loadingUser || loadingPosts) {
    return (
      <div className="flex h-screen items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin fa-5x"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Cover */}
        <div className="relative h-64 overflow-hidden rounded-b-3xl bg-[#6591B7]">
          {user?.cover && (
            <img
              src={user.cover}
              alt="cover"
              className="h-full w-full object-cover"
            />
          )}
          <button
            type="button"
            className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            <i className="fa-regular fa-image"></i>
            Add cover
          </button>
        </div>

        <div className="-mt-20 rounded-3xl bg-white p-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="group relative h-36 w-36 shrink-0">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-200 text-4xl text-slate-500">
                    <i className="fa-solid fa-user"></i>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white opacity-0 shadow-md transition-opacity hover:bg-blue-600 group-hover:opacity-100 disabled:opacity-60"
                >
                  {isUploading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-camera"></i>
                  )}
                </button>

                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-900">
                  {user?.name}
                </h1>
                <p className="text-xl text-slate-500">@{user?.username}</p>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                  <i className="fa-regular fa-user"></i>
                  Route Posts member
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-40 rounded-2xl border border-slate-200 px-4 py-4 text-center">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Followers
                </p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {user?.followersCount ?? 0}
                </p>
              </div>
              <div className="w-40 rounded-2xl border border-slate-200 px-4 py-4 text-center">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Following
                </p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {user?.followingCount ?? 0}
                </p>
              </div>
              <div className="w-40 rounded-2xl border border-slate-200 px-4 py-4 text-center">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Bookmarks
                </p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {user?.bookmarksCount ?? savedPosts.length}
                </p>
              </div>
            </div>
          </div>

     
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_490px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-3 font-bold text-slate-900">About</h3>
              <p className="mb-2 flex items-center gap-3 text-slate-700">
                <i className="fa-regular fa-envelope"></i>
                {user?.email}
              </p>
              <p className="flex items-center gap-3 text-slate-700">
                <i className="fa-regular fa-user"></i>
                Active on Route Posts
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-xs font-bold uppercase text-blue-900">
                  My posts
                </p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {myPosts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-xs font-bold uppercase text-blue-900">
                  Saved posts
                </p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {savedPosts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

  
        <div className="mt-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex gap-1 rounded-2xl bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => setTab("myPosts")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                tab === "myPosts"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-regular fa-file-lines"></i>
              My Posts
            </button>
            <button
              type="button"
              onClick={() => setTab("saved")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                tab === "saved"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-regular fa-bookmark"></i>
              Saved
            </button>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
            {postsToShow.length}
          </span>
        </div>

   
        <div className="mt-4 flex flex-col gap-5">
          {postsToShow.length ? (
            postsToShow.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="rounded-3xl bg-white px-5 py-12 text-center text-slate-500 shadow-sm">
              {tab === "myPosts"
                ? "You have no posts yet."
                : "No saved posts yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
