import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TopComment } from "../../Interface/PostInterface";

const TheComments = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [fileName, setFileName] = useState("");
  const newRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const config = {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  };
  const base = `https://route-posts.routemisr.com/posts/${postId}/comments`;

  // ---------- my data ----------
  function getMyData() {
    return axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      config,
    );
  }
  const { data: myData } = useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
  });
  const myId = myData?.data.data.user._id;

  // ---------- get comments ----------
  function getComments() {
    return axios.get(`${base}?page=1&limit=10`, config);
  }
  const { data, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: getComments,
  });
  const comments: TopComment[] = data?.data.data.comments ?? [];

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
  }

  function showError(error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    }
  }

  // ---------- create comment ----------
  function createComment(formData: FormData) {
    return axios.post(base, formData, config);
  }

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment added");
      if (newRef.current) newRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
      setFileName("");
      setShowPicker(false);
      refresh();
    },
    onError: showError,
  });

  function handleCreate() {
    const content = newRef.current?.value.trim();
    const image = imageRef.current?.files?.[0];
    if (!content && !image) return;

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);
    createMutate(formData);
  }

  // ---------- update comment ----------
  function updateComment({ id, formData }: { id: string; formData: FormData }) {
    return axios.put(`${base}/${id}`, formData, config);
  }

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toast.success("Comment updated");
      setEditingId(null);
      refresh();
    },
    onError: showError,
  });

  function handleUpdate(id: string) {
    const content = editRef.current?.value.trim();
    if (!content) return;

    const formData = new FormData();
    formData.append("content", content);
    updateMutate({ id, formData });
  }

  // ---------- delete comment ----------
  function deleteComment(id: string) {
    return axios.delete(`${base}/${id}`, config);
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Comment deleted");
      setOpenMenuId(null);
      refresh();
    },
    onError: showError,
  });

  // ---------- emoji ----------
  function handleEmoji(emojiData: EmojiClickData) {
    const textarea = newRef.current;
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
    <div className="border-t border-slate-200 bg-slate-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900">Comments</h4>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
            {comments.length}
          </span>
        </div>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none">
          <option>Most relevant</option>
          <option>Newest</option>
        </select>
      </div>


      {isLoading ? (
        <div className="flex justify-center py-8">
          <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
        </div>
      ) : comments.length ? (
        <div className="mb-4 flex flex-col gap-3">
          {comments.map((comment) => {
            const isMine = comment.commentCreator._id === myId;
            return (
              <div key={comment._id} className="flex items-start gap-2">
                <img
                  src={comment.commentCreator.photo}
                  alt={comment.commentCreator.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1 rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      {comment.commentCreator.name}
                    </p>

                    {isMine && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === comment._id ? null : comment._id,
                            )
                          }
                          className="text-slate-500 hover:text-slate-800"
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>

                        {openMenuId === comment._id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-md">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(comment._id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Delete this comment?"))
                                  deleteMutate(comment._id);
                              }}
                              disabled={isDeleting}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingId === comment._id ? (
                    <div className="mt-1">
                      <textarea
                        ref={editRef}
                        defaultValue={comment.content}
                        className="h-16 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800 outline-none focus:border-blue-300"
                      ></textarea>
                      <div className="mt-1 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate(comment._id)}
                          disabled={isUpdating}
                          className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-60"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    comment.content && (
                      <p className="text-sm text-slate-800">{comment.content}</p>
                    )
                  )}

                  {comment.image && (
                    <img
                      src={comment.image}
                      alt=""
                      className="mt-2 max-h-60 rounded-xl object-cover"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-4 flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
            <i className="fa-regular fa-comment"></i>
          </div>
          <p className="text-lg font-bold text-slate-900">No comments yet</p>
          <p className="text-sm text-slate-500">Be the first to comment.</p>
        </div>
      )}

      {/* Create comment */}
      <div className="flex items-start gap-3">
        {myData?.data.data.user.photo ? (
          <img
            src={myData.data.data.user.photo}
            alt={myData.data.data.user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <i className="fa-regular fa-user"></i>
          </div>
        )}

        <div className="relative flex-1 rounded-2xl border border-blue-200 bg-white p-3">
          <textarea
            ref={newRef}
            placeholder={`Comment as ${myData?.data.data.user.name ?? ""}...`}
            className="h-14 w-full resize-none text-sm text-slate-800 outline-none placeholder:text-slate-400"
          ></textarea>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                <i className="fa-regular fa-image text-lg"></i>
              </button>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
              <button
                type="button"
                onClick={() => setShowPicker((prev) => !prev)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                <i className="fa-regular fa-face-smile text-lg"></i>
              </button>
              {fileName && (
                <span className="max-w-40 truncate text-xs text-slate-500">
                  {fileName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 disabled:opacity-60"
            >
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>

          {showPicker && (
            <div className="absolute bottom-full left-0 z-50 mb-2">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheComments;