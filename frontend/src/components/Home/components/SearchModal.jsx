import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
// Algolia v5 removed the default export; use the named liteClient export instead
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { hits, configure } from "instantsearch.js/es/widgets";
import { ArrowRight, CircleX, Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { domainOptions } from "@/utils/Options";

// Update your categories to match domainOptions
const categories = domainOptions.map((domain) => ({
  title: domain.label,
  value: domain.value,
  hasArrow: true,
}));

const CategoryButton = memo(({ category, onCategorySelect, onClose }) => {
  const handleExplore = () => {
    onCategorySelect(category);
    onClose();
  };
  return (
    <motion.button
      onClick={handleExplore}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center border justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 hover:text-black text-zinc-800 font-bold transition-colors"
    >
      <span className="font-medium text-center grow">{category.title}</span>
      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </motion.button>
  );
});

CategoryButton.displayName = "CategoryButton";

const SearchModal = ({ isOpen, onClose, onCategorySelect = () => { } }) => {
  const searchRef = useRef(null);
  const searchClient = useRef(null);
  const searchInputRef = useRef(null);
  const [searchState, setSearchState] = useState({
    hasQuery: false,
    showAll: false,
    hasResults: true,
  });

  const navigate = useNavigate();

  // Memoize the search client creation
  useEffect(() => {
    if (!searchClient.current) {
      searchClient.current = algoliasearch(
        "XWATQTV8D5",
        "1d072ac04759ef34bc76e8216964c29e"
      );
    }
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (searchRef.current) {
        searchRef.current.helper.setQuery(query).search();
      }
    }, 300),
    []
  );

  // Auto-focus the search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use setTimeout to ensure the modal is fully rendered before focusing
      const timer = setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !searchRef.current) {
      searchRef.current = instantsearch({
        indexName: "experts_index",
        searchClient: searchClient.current,
        initialUiState: {
          experts_index: { query: "" },
        },
      });

      const hitWidget = hits({
        container: "#hits",
        transformItems: (items) => items.map(h => ({
          ...h,
          slug: h.redirect_url || h.username || h.objectID || null,
        })),
        templates: {
          item: (hit) => {
            const safeSlug = hit.slug ? String(hit.slug).replace(/"/g, '&quot;') : '';
            
            // Format domain name to be more readable
            const formatDomain = (domain) => {
              if (!domain) return '';
              return domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            };
            
            // Get niche skills (first 2 for brevity)
            const nicheSkills = hit.niche && Array.isArray(hit.niche) ? hit.niche.slice(0, 2) : [];
            const nicheText = nicheSkills.length > 0 
              ? nicheSkills.map(skill => skill.replace(/_/g, ' ')).join(', ')
              : '';
            
            // Combine domain and niche for display
            const domainText = formatDomain(hit.domain);
            const expertiseDisplay = nicheText ? `${domainText} • ${nicheText}` : domainText;
            
            const expertiseText = expertiseDisplay ? `<div class="text-xs text-gray-500 truncate">${expertiseDisplay}</div>` : '';
            
            return `
              <div class="flex items-center justify-between w-full bg-white border rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 mb-2 py-2 px-3" data-slug="${safeSlug}">
                <div class="flex items-center grow space-x-3 cursor-pointer min-w-0" ${safeSlug ? `onclick=\"window.location.href='/expert/${safeSlug}'\"` : 'disabled'} >
                  <img
                    src="${hit.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"}"
                    alt="${hit.name}"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div class="flex flex-col min-w-0 flex-grow">
                    <div class="text-sm font-medium truncate">
                      ${instantsearch.highlight({ attribute: "name", hit })}
                    </div>
                    ${expertiseText}
                  </div>
                </div>
                <button
                  class="p-2 flex-none rounded-full hover:bg-gray-100 transition-colors duration-300 ${safeSlug ? '' : 'opacity-40 cursor-not-allowed'}"
                  ${safeSlug ? `onclick=\"window.location.href='/expert/${safeSlug}'\"` : 'disabled'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>`;
          },
          empty: () => {
            setSearchState((prev) => ({ ...prev, hasResults: false }));
            return `
              <div class="text-center py-4 text-gray-500">
                No experts found matching your search.
              </div>
            `;
          },
        },
        cssClasses: { list: "space-y-2" },
      });

      searchRef.current.addWidgets([
        configure({ 
          hitsPerPage: 3,
          attributesToRetrieve: ['name', 'profileImage', 'domain', 'niche', 'services', 'redirect_url', 'username', 'objectID', 'bio']
        }),
        hitWidget,
      ]);

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
      setSearchState({ hasQuery: false, showAll: false, hasResults: true });
      debouncedSearch("");
    }
  }, [debouncedSearch]);

  const toggleShowAll = useCallback(() => {
    setSearchState((prev) => ({ ...prev, showAll: !prev.showAll }));
    navigate("/explore");
  }, [navigate]);

  const categoriesGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
      <div className="relative w-full h-full md:h-auto flex items-center justify-center">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
          className="relative bg-white w-full max-w-[800px] mx-auto p-4 sm:p-6 md:p-8 rounded-2xl h-[85vh] sm:h-[80vh] lg:h-[60vh] max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className=" flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Find an Expert</h2>
            <button
              onClick={onClose}
              className=" text-gray-400 hover:text-gray-600 focus:outline-none z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="w-5 h-5 text-gray-600" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-green-500 transition-colors duration-300"
              placeholder="Search experts by name or expertise..."
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

          <motion.div
            id="hits"
            className={`mb-8 ${searchState.hasQuery ? "block" : "hidden"}`}
          >
            <AnimatePresence>
              {searchState.hasQuery && (
                <motion.div
                  key="hits-content"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
                >
                  <div
                    id="initial-hits"
                    className={`${searchState.showAll ? "hidden" : "block"}`}
                  ></div>
                  <div
                    id="all-hits"
                    className={`${searchState.showAll ? "block" : "hidden"}`}
                  ></div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            layout
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-2">Explore by Category</h3>
            {categoriesGrid}
          </motion.div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default SearchModal;
