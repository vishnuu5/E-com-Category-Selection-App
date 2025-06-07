"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";

export default function InterestsPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=20");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryIds: selectedCategories }),
      });

      if (response.ok) {
        router.push("/categories");
      } else {
        alert("Failed to save interests. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save interests:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Interests
        </h1>
        <p className="text-gray-600 text-lg">
          Select categories that interest you to get personalized
          recommendations
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Selected: {selectedCategories.length} categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => toggleCategory(category._id)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                selectedCategories.includes(category._id)
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.description}
              </p>
            </div>

            {selectedCategories.includes(category._id) && (
              <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0 || isSubmitting}
          className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          <span>{isSubmitting ? "Saving..." : "Continue"}</span>
          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
