import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../Interface/PostInterface";
import TheComments from "../TheComments/TheComments";
import { useNavigate } from "react-router-dom";
function timeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const PostCard = ({ post, details }: { post: Post; details?: boolean }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
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

  const isMine = post.user._id === myData?.data.data.user._id;

  function updatePost(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    },
  });
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted");
      setShowMenu(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    },
  });
  function bookmarkPost() {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  );
}

const { mutate: bookmarkMutate, isPending: isSaving } = useMutation({
  mutationFn: bookmarkPost,
  onSuccess: () => {
    toast.success(post.bookmarked ? "Removed from saved" : "Post saved");
    setShowMenu(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
    queryClient.invalidateQueries({ queryKey: ["myData"] });
  },
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    }
  },
});
  function handleSave() {
    const body = editRef.current?.value.trim();
    const image = imageRef.current?.files?.[0];
    if (!body && !image) return;

    const formData = new FormData();
    if (body) formData.append("body", body);
    if (image) formData.append("image", image);
    mutate(formData);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.user.photo}
            alt={post.user.name}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-bold text-slate-900">{post.user.name}</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{timeAgo(post.createdAt)}</span>
              <span>·</span>
              <i className="fa-solid fa-earth-americas"></i>
              <span className="capitalize">{post.privacy}</span>
            </p>
          </div>
        </div>

<div className="relative">
  <button
    type="button"
    onClick={() => setShowMenu((prev) => !prev)}
    className="text-slate-500 hover:text-slate-800"
  >
    <i className="fa-solid fa-ellipsis"></i>
  </button>

  {showMenu && (
    <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-md">
      <button
        type="button"
        onClick={() => bookmarkMutate()}
        disabled={isSaving}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
      >
        <i
          className={`${post.bookmarked ? "fa-solid" : "fa-regular"} fa-bookmark`}
        ></i>
        {post.bookmarked ? "Unsave post" : "Save post"}
      </button>

      {isMine && (
        <>
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <i className="fa-regular fa-pen-to-square"></i>
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete this post?")) deleteMutate();
            }}
            disabled={isDeleting}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <i className="fa-regular fa-trash-can"></i>
            Delete Post
          </button>
        </>
      )}
    </div>
  )}
</div>

      </div>

      {isEditing ? (
        <div className="px-4 pb-3">
          <textarea
            ref={editRef}
            defaultValue={post.body}
            className="h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none focus:border-blue-300"
          ></textarea>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <i className="fa-regular fa-image text-lg text-emerald-600"></i>
              Change image
            </button>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        post.body && <p className="px-4 pb-3 text-slate-800">{post.body}</p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="max-h-[480px] w-full object-cover"
        />
      )}

      <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
            <i className="fa-regular fa-thumbs-up"></i>
          </span>
          {post.likesCount} likes
        </div>
        <div className="flex items-center gap-4">
          <span>
            <i className="fa-solid fa-retweet mr-1"></i>
            {post.sharesCount} shares
          </span>
          <span>{post.commentsCount} comments</span>
          <button
            type="button"
            onClick={() => navigate(`/post/${post._id}`)}
            className="font-bold text-blue-600 hover:underline"
          >
            View details
          </button>
        </div>
      </div>

      <div className="mx-4 grid grid-cols-3 border-t border-slate-200 py-2 text-sm font-semibold text-slate-600">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg py-2 hover:bg-slate-50"
        >
          <i className="fa-regular fa-thumbs-up"></i>
          Like
        </button>
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center justify-center gap-2 rounded-lg py-2 hover:bg-slate-50"
        >
          <i className="fa-regular fa-comment"></i>
          Comment
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg py-2 hover:bg-slate-50"
        >
          <i className="fa-solid fa-share-nodes"></i>
          Share
        </button>
      </div>
      {details && post.topComment && !showComments && (
        <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-slate-500">
            Top comment
          </p>
          <div className="flex items-start gap-2">
            <img
              src={post.topComment.commentCreator.photo}
              alt={post.topComment.commentCreator.name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="flex-1 rounded-2xl bg-white px-3 py-2">
              <p className="text-sm font-bold text-slate-900">
                {post.topComment.commentCreator.name}
              </p>
              <p className="text-sm text-slate-800">
                {post.topComment.content}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowComments(true)}
            className="mt-3 text-sm font-bold text-blue-600 hover:underline"
          >
            View all comments
          </button>
        </div>
      )}
      {showComments && <TheComments postId={post._id} />}
    </div>
  );
};

export default PostCard;