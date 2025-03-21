import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Check if there is a search query
    if (query.trim() !== "") {
      navigate(`/course/search?query=${query}`);
      console.log("Search query:", query);
    } else {
      toast.error("Please enter a search query");
    }
    // Clear the search input
    setQuery("");
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-28 px-4 text-center">
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-white text-4xl font-bold mb-4 ">
          Learn Smarter, Achieve More!
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Revolutionize the way you learn with our cutting-edge Learning
          Management System. From interactive courses to seamless progress
          tracking, we make education accessible, engaging, and effective for
          everyone, everywhere.
        </p>
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto  "
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Courses..."
            className="flex-grow outline-none border-none focus-visible:ring-0 px-6 py-3 text-gray-900  placeholder-gray-400 dark:placeholder-gray-500  "
          />
          <button
            type="submit"
            className=" outline-none border-none bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 "
          >
            Search
          </button>
        </form>
        <button onClick={()=>navigate("/course/search?query")} className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200 px-4 py-2 mt-4">
          Explore Courses
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
