import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const PodcastCard = ({ image, title, url, description, source, sourceUrl, publishedAt }) => {
  return (
    <div className="group bg-white flex flex-col h-full border border-neutral-200 transition-all duration-300 hover:border-neutral-400">
      <div className="relative overflow-hidden aspect-video border-b border-neutral-100 bg-neutral-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover grayscale-20 contrast-105 transition-transform duration-700 ease-out group-hover:scale-102 group-hover:grayscale-0"
        />
        {publishedAt && (
          <p className="manrope absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-1">
            {publishedAt.split("T")[0]}
          </p>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <Link 
          to={sourceUrl || "#"} 
          className="manrope text-[11px] w-full font-bold uppercase tracking-wide text-red-700 mb-2.5 transition-colors hover:text-red-900"
        >
          {source || "Source Unavailable"}
        </Link>

        <h3 className="lora text-xl font-medium text-neutral-900 mb-3 line-clamp-2 w-full leading-snug tracking-tight group-hover:text-neutral-800">
          {title}
        </h3>

        <p className="lora text-neutral-600 text-[14px] leading-relaxed mb-6 line-clamp-3 font-normal">
          {description}
        </p>

        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="manrope inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-neutral-800 group/link transition-colors hover:text-neutral-500"
          >
            <Link2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400 transition-colors group-hover/link:text-neutral-600" />
            Read full article
          </a>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
