"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [currentPage, setCurrentPage] = useState(4); // Starting at page 4 as shown in design
  const [totalPages, setTotalPages] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Mock categories data to match the design
  const mockCategories = [
    { _id: "1", name: "Shoes", checked: true },
    { _id: "2", name: "Men T-shirts", checked: false },
    { _id: "3", name: "Makeup", checked: true },
    { _id: "4", name: "Jewellery", checked: true },
    { _id: "5", name: "Women T-shirts", checked: false },
    { _id: "6", name: "Furniture", checked: true },
  ];

  useEffect(() => {
    checkAuth();
    // Set mock data
    setCategories(mockCategories);
    setUserInterests(
      mockCategories.filter((cat) => cat.checked).map((cat) => cat._id)
    );
    setIsLoading(false);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  };

  const toggleInterest = async (categoryId) => {
    setIsUpdating(true);
    const isCurrentlySelected = userInterests.includes(categoryId);

    try {
      // Update local state immediately for better UX
      if (isCurrentlySelected) {
        setUserInterests((prev) => prev.filter((id) => id !== categoryId));
      } else {
        setUserInterests((prev) => [...prev, categoryId]);
      }

      // Update categories display
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, checked: !isCurrentlySelected }
            : cat
        )
      );

      // Here you would make the API call
      // const response = await fetch("/api/user/interests", { ... })
    } catch (error) {
      console.error("Failed to update interests:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-4">
            Please mark your interests!
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            We will keep you notified.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-black mb-6">
            My saved interests!
          </h2>

          <div className="space-y-4">
            {categories.map((category) => (
              <label
                key={category._id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={category.checked}
                    onChange={() => toggleInterest(category._id)}
                    disabled={isUpdating}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded ${
                      category.checked
                        ? "bg-black border-black"
                        : "bg-white border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {category.checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <button
            onClick={() => goToPage(1)}
            className="px-2 py-1 text-gray-400 hover:text-gray-600"
          >
            {"<<"}
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-2 py-1 text-gray-400 hover:text-gray-600"
          >
            {"<"}
          </button>

          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-black text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 py-1 text-gray-400">...</span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-2 py-1 text-gray-400 hover:text-gray-600"
          >
            {">"}
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            className="px-2 py-1 text-gray-400 hover:text-gray-600"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
