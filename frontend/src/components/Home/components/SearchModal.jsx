import { motion } from "framer-motion";
import Modal from "./Modal";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { hits, configure } from "instantsearch.js/es/widgets";
import { ArrowRight, CircleX, Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { domainOptions } from "@/utils/Options";

// Create category button list
const categories = domainOptions.map((domain) => ({
  title: domain.label,
  value: domain.value,
  hasArrow: true,
}));

const CategoryButton = memo(({ category, onCategorySelect, onClose }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    onCategorySelect(category);
    navigate(`/explore?category=${category.value}`);
    onClose();
  };

  return (
    <motion.button
      onClick={handleExplore}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center border justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:text-black text-zinc-800 font-bold transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="font-medium">{category.title}</span>
      </div>
      {category.hasArrow && <ArrowRight className="w-5 h-5 text-gray-400" />}
    </motion.button>
  );
});
CategoryButton.displayName = "CategoryButton";

const SearchModal = ({ isOpen, onClose, onCategorySelect }) => {
  const searchRef = useRef(null);
  const searchClient = useRef(null);
  const searchInputRef = useRef(null);

  const [searchState, setSearchState] = useState({
    hasQuery: false,
    showAll: false,
    hasResults: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!searchClient.current) {
      searchClient.current = algoliasearch(
        "XWATQTV8D5",
        "1d072ac04759ef34bc76e8216964c29e"
      );
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (searchRef.current) {
        searchRef.current.helper.setQuery(query).search();
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (isOpen && !searchRef.current) {
      searchRef.current = instantsearch({
        indexName: "experts_index",
        searchClient: searchClient.current,
        initialUiState: {
          experts_index: {
            query: "",
          },
        },
      });

      const hitWidget = hits({
        container: "#initial-hits",
        templates: {
          item: (hit) => {
            return `
              <div class="flex items-center justify-between w-full bg-white border rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 mb-2 py-1 px-3">
                <div class="flex items-center space-x-3">
                  <img
                    src="${hit.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"}"
                    alt="${hit.name}"
                    class="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <span class="text-sm font-medium truncate">
                    ${instantsearch.highlight({ attribute: "name", hit })}
                  </span>
                </div>
                <button 
                  class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  onclick="window.location.href='/expert/${hit.username}'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            `;
          },
          empty: () => {
            setSearchState((prev) => ({ ...prev, hasResults: false }));
            return `<div class="text-center py-4 text-gray-500">
                      No experts found matching your search.
                    </div>`;
          },
        },
        cssClasses: { list: "space-y-2" },
      });

      searchRef.current.addWidgets([configure({ hitsPerPage: 3 }), hitWidget]);

      searchRef.current.on("render", () => {
        const results = searchRef.current.helper.lastResults;
        setSearchState((prev) => ({
          ...prev,
          hasResults: results && results.nbHits > 0,
        }));
      });

      searchRef.current.start();
    }

    return () => {
      if (searchRef.current) {
        searchRef.current.dispose();
        searchRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSearchInputChange = useCallback(
    (event) => {
      const query = event.target.value;
      setSearchState((prev) => ({ ...prev, hasQuery: query.length > 0 }));
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const clearSearchInput = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setSearchState({
        hasQuery: false,
        hasResults: true,
        showAll: false,
      });
      debouncedSearch("");
    }
  }, [debouncedSearch]);

  const toggleShowAll = useCallback(() => {
    setSearchState((prev) => ({ ...prev, showAll: !prev.showAll }));
    navigate("/explore");
  }, []);

  const categoriesGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((category) => (
          <CategoryButton
            key={category.value}
            category={category}
            onCategorySelect={onCategorySelect}
            onClose={onClose}
          />
        ))}
      </div>
    ),
    [onCategorySelect, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="fixed top-20 w-full h-full md:h-auto">
        <div className="relative bg-white w-full max-w-[800px] mx-auto p-3 sm:p-6 md:p-8 
                        md:min-h-0 md:rounded-2xl max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header and Input */}
          <div className="sticky top-0 bg-white pb-2">
            <h2 className="text-2xl font-bold mb-3 mt-2">Find an Expert</h2>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Search className="w-5 h-5 text-gray-600" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 
                           focus:outline-none focus:border-green-500 transition-colors duration-300"
                placeholder="Search for experts..."
                onChange={handleSearchInputChange}
              />
              {searchState.hasQuery && (
                <button
                  onClick={clearSearchInput}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                >
                  <CircleX className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Hits Section */}
          <div
            id="hits"
            className={`${searchState.hasQuery ? "block" : "hidden"} mb-4`}
          >
            <div
              id="initial-hits"
              className={`${searchState.showAll ? "hidden" : "block"}`}
            ></div>
            <div
              id="all-hits"
              className={`${searchState.showAll ? "block" : "hidden"}`}
            ></div>
          </div>

          {/* See all results button */}
          {searchState.hasQuery &&
            !searchState.showAll &&
            searchState.hasResults && (
              <button
                onClick={toggleShowAll}
                className="w-full flex items-center rounded-full justify-center gap-4 text-center text-black border border-gray-300 focus:outline-none py-2 mt-2"
              >
                see all results
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
            )}

          {/* Category Grid */}
          <h3 className="text-lg font-semibold mb-2 mt-6">
            Explore by Category
          </h3>
          {categoriesGrid}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
