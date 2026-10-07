import { useState } from "react";
import { Appbar } from "../components/appbar";
import { useCreateBlog } from "../hooks";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createBlog, loading } = useCreateBlog();
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      const post = await createBlog({ title, content });
      navigate(`/blog/${post.id}`);
    } catch (error) {
      alert("Failed to publish blog. Please ensure you are logged in.");
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full px-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none mb-4"
          />

          <textarea
            rows={10}
            placeholder="Write your article here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none mb-4 resize-y"
          />

          <button
            onClick={handlePublish}
            disabled={loading}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publish;