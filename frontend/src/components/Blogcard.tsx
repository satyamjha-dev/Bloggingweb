import { Link } from "react-router-dom";

interface BlogCardProps {

  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id : string;
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
  id
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
    <div className=" p-4 flex flex-col gap-2 border-b border-gray-200 cursor-pointer">
      <div> 
        <Avatar authorName={authorName} />
        <span className="text-xs font-serif">{authorName}.  </span>
        <span className="text-xs font-serif">•</span>
        <span className="text-xs text-muted-foreground">
          {publishedDate}
        </span>
      </div>
        <div className="text-lg font-bold">{title}</div>
        <div>{content.slice(0,100) + "..."}</div>
        <div className="text-xs text-muted-foreground">
            {`${Math.ceil(content.length / 100)} min read`}
        </div>
    </div>
    </Link>
  );
};

export const Avatar = ({ authorName, size = 4 }: { authorName: string; size?: number }) => {
  // Convert Tailwind size scale to rem units (e.g., size 4 = 1rem = 16px)
  const dimension = `${size * 0.25}rem`;

  return (
    <div
      className="relative bg-gray-600 inline-flex items-center justify-center overflow-hidden bg-neutral-tertiary rounded-full dark:bg-neutral-700"
      style={{ width: dimension, height: dimension }}
    >
      <span className="font-medium text-xs uppercase">{authorName[0]}</span>
    </div>
  );
};
