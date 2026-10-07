import { Link } from "react-router-dom";
import { Avatar } from "../components/Blogcard";

export const Appbar = () => {

  return (
    <div className="flex  justify-between items-center px-10 border-b border-gray-200 py-4">
      <Link to={"/blogs"}  className="text-lg font-bold cursor-pointer">
        Medium
      </Link>
      
      <div className="flex items-center space-x-5">
        <Link to={"/publish"}>
              <button 
  type="button" 
  className="text-white bg-green-600 box-border border border-transparent hover:bg-green-700 focus:ring-2 focus:ring-green-300 shadow-xs font-small leading-5 rounded-full text-sm px-2 py-1 focus:outline-none"
>
  Publish
</button>
        </Link>
  

        <Avatar
        authorName="Satyam jha"
        size={6}
      />
      </div>

      
    </div>
  );
}
 