import { useState, useCallback } from 'react';

export const useSearch = (items = [], searchableFields = []) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchQuery
  ? items.filter((item) =>
      searchableFields.some((field) => {
        const value = item?.[field]; 
        console.log(`Checking field: ${field}, Value: ${value}, Query: ${searchQuery}`);
        return typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase());
      })
    )
  : items; // Return all items if no search query


  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    filteredItems,
    handleSearch
  };
};
