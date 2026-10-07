//! atom families,selector familis can be used here 
import { useBlog } from "../hooks/index";
import { Fullblog } from "../components/fullblog";
import { useParams } from "react-router-dom";
export const Blog = () => {
  const {id} = useParams();
  const { loading, blog } = useBlog({
    id: id || ""
  });

  if (loading) {
    return <div>loading .....</div>;
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