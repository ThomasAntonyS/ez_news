import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const PodcastCard = ({ image, title, url, description, source, sourceUrl, publishedAt }) => {
  return (
    <div className="group border-2 border-black bg-white flex flex-col h-full transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {publishedAt && (
        <p className="absolute top-2 right-2 py-1 px-2 bg-black text-white text-[10px] font-bold z-10">
          {publishedAt.split("T")[0]}
        </p>
      )}

      <div className="overflow-hidden border-b-2 border-black">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <Link to={sourceUrl || "#"} className="text-[10px] w-max font-black uppercase tracking-widest text-red-600 mb-2 hover:underline">
          {source || "Source Unavailable"}
        </Link>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight uppercase">
          {title}
        </h3>

        <p className="text-gray-800 text-sm mb-10 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto flex items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs font-black uppercase tracking-wide hover:underline"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Know more
          </a>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;