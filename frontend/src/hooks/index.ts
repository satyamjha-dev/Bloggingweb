import {useEffect, useState} from "react";
import axios from "axios";
export interface Blog {
  id: string;
  content: string;
  title: string;
  authorId?: string;
  author?: {
    name: string | null;
  };
}
export const useBlog = ({ id }: { id: string | undefined }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null); 

  useEffect(() => {
    // Agar id undefined ya null hai, to API call mat karo
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8787/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        // response.data.blog ya blogs jo bhi aapka backend bhej raha hai
        setBlog(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setLoading(false);
      });
  }, [id]); 

  return { loading, blog };
};
export const useblogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    useEffect(() => {
      const res = axios.get("http://localhost:8787/api/v1/blog/bulk",{headers: {Authorization: `Bearer ${localStorage.getItem("jwt")}`}}); //! yaha pe jwt ko authorization header me bhej rahe hai
         res.then((response) => {  
            setBlogs(response.data);
            setLoading(false);
         }).catch((error) => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
         });    
    }, []); //jab bhi dependency aray change hoga tabhi ye function chalega 
    return { loading, blogs };
}
export interface CreateBlogInput {
  title: string;
  content: string;
}

export const useCreateBlog = () => {
  const [loading, setLoading] = useState(false);

  const createBlog = async ({ title, content }: CreateBlogInput) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8787/api/v1/blog/add",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      setLoading(false);
      return response.data; // { id: string }
    } catch (error) {
      setLoading(false);
      console.error("Error creating blog:", error);
      throw error;
    }
  };

  return { createBlog, loading };
};