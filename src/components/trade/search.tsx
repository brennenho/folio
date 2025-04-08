"use client";

import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

type TickerResult = {
  ticker: string;
  name: string;
};

export function useTickerSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TickerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // debounced search to avoid making too many API calls
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setQuery(searchQuery);
    }, 300),
    [],
  );

  // effect to handle search
  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to search stocks");
        }

        const data = await response.json();
        const transformedResults: TickerResult[] = data.map((item: any) => ({
          ticker: item.ticker,
          name: item.name,
        }));

        setResults(transformedResults);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to search stocks",
        );
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return {
    results,
    isLoading,
    error,
    search: debouncedSearch,
    query,
  };
}
