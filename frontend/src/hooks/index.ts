import {useEffect, useState} from "react";
import axios from "axios";
interface Blog {
    "content":string,
    "title":string,
    "authorId":string,
    "author": {
      "name": null
      }  
}
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