import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

const CreatePost = ({ name, photo }: { name?: string; photo?: string }) => {
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  function createPost(formData: FormData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created");
      if (bodyRef.current) bodyRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    },
  });

  function handlePost() {
    const body = bodyRef.current?.value.trim();
    const image = imageRef.current?.files?.[0];
    if (!body && !image) return;

    const formData = new FormData();
    if (body) formData.append("body", body);
    if (image) formData.append("image", image);
    mutate(formData);
  }
  function handleEmoji(emojiData: EmojiClickData) {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value =
      textarea.value.slice(0, start) +
      emojiData.emoji +
      textarea.value.slice(end);

    const pos = start + emojiData.emoji.length;
    textarea.setSelectionRange(pos, pos);
    textarea.focus();
  }
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-500">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <i className="fa-regular fa-user text-lg"></i>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          <div className="mt-1 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
            <i className="fa-solid fa-earth-americas"></i>
            <select className="bg-transparent outline-none">
              <option>Public</option>
              <option>Followers</option>
              <option>Only me</option>
            </select>
          </div>
        </div>
      </div>

      <textarea
        ref={bodyRef}
        placeholder={`What's on your mind, ${name ?? ""}?`}
        className="h-40 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300"
      ></textarea>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            className="cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-emerald-200 "
          >
            <i className="fa-regular fa-image text-lg text-emerald-600"></i>
            Photo/video
          </button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPicker((prev) => !prev)}
              className="cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-amber-200"
            >
              <i className="fa-regular fa-face-smile text-lg text-amber-500"></i>
              Feeling/activity
            </button>

            {showPicker && (
              <div className="absolute left-0 top-full z-50 mt-2">
                <EmojiPicker onEmojiClick={handleEmoji} />
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            handlePost();
            setShowPicker(false);
          }}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-blue-400 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          Post
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
