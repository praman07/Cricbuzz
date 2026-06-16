export const NewsCard = ({ news }) => {
  return (
    <div className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
      {news.image ? (
        <img
          src={news.image}
          alt={news.title}
          className="w-20 h-16 rounded-md object-cover shrink-0"
        />
      ) : (
        <div className="w-20 h-16 rounded-md shrink-0 bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-semibold">
          Update
        </div>
      )}

      <div className="flex flex-col justify-between">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-green-600 cursor-pointer">
          {news.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{news.time}</span>
          <span>•</span>
          <span>{news.category || "Match Feed"}</span>
        </div>
      </div>
    </div>
  );
};
