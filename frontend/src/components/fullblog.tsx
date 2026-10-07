import { type Blog } from "../hooks/index"
import { Appbar } from "./appbar"
import { Avatar } from "./Blogcard";

export const Fullblog = ({ blog }: { blog: Blog }) => {

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl">
                    
                    {/* Left Side: Main Blog Content */}
                    <div className="col-span-8 pr-10">
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
                            {blog?.title}
                        </h1>
                        <p className="text-slate-500 pt-2 font-medium">
                            {/* Static date for now, or use a dynamic date if available */}
                            Posted on August 24, 2023
                        </p>
                        <div className="pt-4 text-slate-700 whitespace-pre-line leading-relaxed text-[17px]">
                            {blog?.content}
                        </div>
                    </div>

                    {/* Right Side: Author Details */}
                    <div className="col-span-4 border-l border-slate-100 pl-6">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Author
                        </span>
                        <div className="flex items-start pt-3 gap-x-4">
                            <div>
                               <Avatar size={6} authorName={blog?.author?.name ?? "Jokester"} />
                            </div>
                            
                     
                            
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {/* You can replace this with blog?.author?.name if available */}
                                    Jokester
                                </h3>
                                <p className="text-slate-500 pt-1 leading-snug text-sm">
                                    Master of mirth, purveyor of puns, and the funniest person in the kingdom.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};