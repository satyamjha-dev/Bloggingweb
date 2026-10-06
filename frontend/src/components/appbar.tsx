import { Avatar } from "../components/Blogcard";

export const Appbar = () => {

  return (
    <div className="flex justify-between items-center px-10 border-b border-gray-200 py-4">
      <div className="text-lg font-bold">
        My Blog
      </div>
      <Avatar
        authorName="Satyam jha"
        size={6}
      />
    </div>
  );
}
 