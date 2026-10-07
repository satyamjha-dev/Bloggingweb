import { Skeleton } from "../components/Skeleton";
import { Appbar } from "../components/appbar";
import {BlogCard} from "../components/Blogcard";
import { useblogs } from "../hooks/index";

export const Blogs = () =>{
    const { loading, blogs } = useblogs();

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center">
                    <div className="max-w-xl w-full">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
        <div className="flex justify-center flex-col items-center">
        <div className=" max-w-xl">
          {blogs.map(blog => <BlogCard
                key = {blog.id}
                id = {blog.id}
                authorName={blog.author?.name || "Satyam jha"}
                title={blog.title}
                content={blog.content}
                publishedDate={"2023-06-01"}
            />)}
        </div>
    </div>
</div>
    );
}