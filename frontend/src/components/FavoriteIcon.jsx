// FavoriteIcon.jsx
import React from 'react';

const FavoriteIcon = ({ isFavorite, onClick }) => {
  const heartIcon = isFavorite ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-red-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.645 20.917 3.03 12.302a1.5 1.5 0 0 1 0-2.121l1.414-1.414a1.5 1.5 0 0 1 2.121 0L12 14.012l5.434-5.435a1.5 1.5 0 0 1 2.121 0l1.414 1.414a1.5 1.5 0 0 1 0 2.121l-8.615 8.615a1.5 1.5 0 0 1-2.121 0Z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
      />
    </svg>
  );

  return (
    <div onClick={onClick} className="cursor-pointer">
      {heartIcon}
    </div>
  );
};

export default FavoriteIcon;
