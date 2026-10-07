import { Appbar } from "./appbar";

export const Skeleton = () => {
  return (
    <div role="status" className="animate-pulse p-4 border-b border-gray-200 w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-3 bg-gray-200 rounded-full w-28"></div>
        <div className="h-3 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded-full w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded-full w-20"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const FullBlogSkeleton = () => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl animate-pulse">
          
          {/* Left Side: Main Blog Content */}
          <div className="col-span-8 pr-10">
            {/* Title */}
            <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-4"></div>
            
            {/* Date */}
            <div className="h-4 bg-gray-200 rounded-md w-48 mb-8"></div>
            
            {/* Body content lines */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            </div>
          </div>

          {/* Right Side: Author Details */}
          <div className="col-span-4 border-l border-slate-100 pl-6">
            {/* Author Label */}
            <div className="h-4 bg-gray-200 rounded-md w-20 mb-4"></div>
            
            <div className="flex items-start gap-x-4 pt-1">
              {/* Avatar Circle */}
              <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
              
              {/* Name & Bio */}
              <div className="w-full space-y-2">
                <div className="h-5 bg-gray-200 rounded-md w-32"></div>
                <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                <div className="h-3 bg-gray-200 rounded-md w-4/5"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <span className="sr-only">Loading blog...</span>
    </div>
  );
};