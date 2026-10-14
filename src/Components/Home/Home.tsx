import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../PostCard/PostCard";
import type { Post } from "../../Interface/PostInterface";
import CreatePost from "../CreatePost/CreatePost";
const Home = () => {
  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
  console.log(data?.data.data.posts);
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

  const [active, setActive] = useState<"feed" | "community" | "saved">("feed");
  const allPosts: Post[] = data?.data.data.posts ?? [];
  const myId = myData?.data.data.user._id;

  const postsToShow =
    active === "community"
      ? allPosts
      : active === "saved"
        ? allPosts.filter((post) => post.bookmarked)
        : allPosts.filter((post) => post.user._id === myId);
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <i className="fa-solid fa-spinner fa-spin fa-7x"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-6">
      <div className="mx-auto grid  grid-cols-[300px_1fr_375px] items-start gap-5 px-4">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 sticky top-20 ">
          <ul className="flex flex-col gap-1">
            <li>
              <a
                onClick={() => setActive("feed")}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                  active === "feed"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                <i className="fa-regular fa-newspaper text-lg"></i>
                Feed
              </a>
            </li>

            <li>
              <a
                onClick={() => setActive("community")}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                  active === "community"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                <i className="fa-regular fa-compass text-lg"></i>
                Community
              </a>
            </li>
            <li>
              <a
                onClick={() => setActive("saved")}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                  active === "saved"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                <i className="fa-regular fa-bookmark text-lg"></i>
                Saved
              </a>
            </li>
          </ul>
        </aside>

        <main className="flex flex-col gap-5">
          <CreatePost
            name={myData?.data.data.user.name}
            photo={myData?.data.data.user.photo}
          />

          {postsToShow.length ? (
            postsToShow.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <p className="text-slate-500">
                No posts yet. Be the first one to publish.
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 sticky top-20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <i className="fa-solid fa-user-group text-blue-600"></i>
              Suggested Friends
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              5
            </span>
          </div>

          <div className="relative mb-4">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search friends..."
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300"
            />
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                name: "Ahmed Abd Al-...",
                username: "@ahmedmutti",
                followers: "373 followers",
              },
              {
                name: "Alaa Ashraf",
                username: "@alaaashraf",
                followers: "305 followers",
              },
              { name: "MrMo", username: "@mrmo", followers: "234 followers" },
              {
                name: "menna",
                username: "@gbngsssb",
                followers: "193 followers",
              },
              {
                name: "abdalla diaa",
                username: "@abdalla_diaa",
                followers: "185 followers",
              },
            ].map((friend) => (
              <div
                key={friend.username}
                className="rounded-2xl border border-slate-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {friend.name}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {friend.username}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-600 hover:bg-blue-100"
                  >
                    <i className="fa-solid fa-user-plus text-xs"></i>
                    Follow
                  </button>
                </div>
                <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {friend.followers}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
