interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <div className="flex flex-col gap-2 ">
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
        <div className="bg-slate-200 h-1 w-full">

        </div>
    </div>
  );
};

function  Avatar ({authorName}:{authorName:string}) {
    return (
       <div className="relative bg-gray-600  inline-flex items-center justify-center w-5 h-5 overflow-hidden bg-neutral-tertiary rounded-full">
        <span className="font-medium text-xs">{authorName[0]}</span>
        </div>

    );
}