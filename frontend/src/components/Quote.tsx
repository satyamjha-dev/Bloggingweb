export function QuoteSection() {
  return (
    <div className="hidden md:flex flex-col justify-center bg-[#f3f4f6] px-12 lg:px-20 py-12">
      <div className="max-w-xl space-y-4">
        <blockquote className="text-xl lg:text-2xl font-bold tracking-tight text-black leading-snug">
          “The customer service I received was exceptional. The support team
          went above and beyond to address my concerns.”
        </blockquote>
        <div>
          <div className="font-semibold text-black text-base">
            Jules Winnfield
          </div>
          <div className="text-sm text-gray-500">
            CEO, Acme Inc
          </div>
        </div>
      </div>
    </div>
  );
}
