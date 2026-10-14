import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../Interface/PostInterface";
import PostCard from "../PostCard/PostCard";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: getPost,
  });

  const post: Post | undefined = data?.data.data.post;

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-5">
      <div className="mx-auto max-w-3xl px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </button>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <i className="fa-solid fa-spinner fa-spin fa-3x"></i>
          </div>
        ) : post ? (
          <PostCard post={post} details={true} />
        ) : (
          <p className="text-center text-slate-500">Post not found.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;