import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="bg-white relative flex flex-col justify-between items-center m-[10px] shadow-md hover:shadow-lg rounded-md overflow-hidden transition-shadow duration-150 gap-2">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[150px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt="houses"
        />
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-md"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px] flex items-start gap-1.5 justify-center flex-col">
          <div className="flex items-center gap-1 flex-row justify-center">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold text-xl m-0 truncate">{listing.name}</p>
          <p className="text-[#457b9d] font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center justify-center flex-row gap-3">
            <div className="flex items-center justify-center gap-1 flex-row">
              <p className="font-bold text-xs">
                {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1 flex-row">
              <p className="font-bold text-xs">
                {+listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash className="absolute bottom-2 right-2 mb-1 h-[1rem] cursor-pointer text-red-500" onClick={()=>onDelete(listing.id)} />
      )}
      {onEdit && (
        <MdEdit className="absolute bottom-2 right-8 mb-1 h-4 cursor-pointer text-gray-800" onClick={()=>onEdit(listing.id)} />
      )}
    </li>
  );
}