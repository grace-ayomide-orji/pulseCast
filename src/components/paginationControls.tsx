"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, isLoading = false, onPageChange,}: PaginationControlsProps) {
  
    // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  const maxVisibleButtons = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttons = [];

  // Previous button
  buttons.push(
    <button
      key="prev"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1 || isLoading}
      className={`px-2 py-1 rounded transition-colors ${
        currentPage === 1 || isLoading
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <ChevronLeft />
    </button>
  );

    // Current page indicator
  buttons.push(
    <div key="current-page" className="px-3 py-1 bg-blue-600 text-white rounded font-medium">
      {currentPage}
    </div>
  );
  

  // Next button
  buttons.push(
    <button
      key="next"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages || isLoading}
      className={`px-2 py-1 rounded transition-colors ${
        currentPage === totalPages || isLoading
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <ChevronRight />
    </button>
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {buttons}
    </div>
  );
}