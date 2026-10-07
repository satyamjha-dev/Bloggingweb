import { useBlog } from "../hooks/index";
import { Fullblog } from "../components/fullblog";
import { useParams } from "react-router-dom";
import { FullBlogSkeleton } from "../components/Skeleton";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });

  if (loading) {
    return <FullBlogSkeleton />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div>
      <Fullblog blog={blog} />
    </div>
  );
};