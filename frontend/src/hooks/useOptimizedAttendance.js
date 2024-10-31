import { useState, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export const useOptimizedAttendance = (data, options = {}) => {
  const [virtualData, setVirtualData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const parentRef = useRef(null);

  const containerRefCallback = useCallback((node) => {
    if (node !== null) {
      const { height } = node.getBoundingClientRect();
      setContainerHeight(height);
      parentRef.current = node;
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5
  });

  const virtualRows = useMemo(() => 
    rowVirtualizer.getVirtualItems(), 
    [rowVirtualizer, data]
  );

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !options.hasMore) return;
    setIsLoading(true);
    try {
      const newData = await options.loadMore();
      setVirtualData(prev => [...prev, ...newData]);
    } finally {
      setIsLoading(false);
    }
  }, [options, isLoading]);

  const memoizedData = useMemo(() => ({
    items: virtualRows.map(virtualRow => ({
      ...data[virtualRow.index],
      virtualIndex: virtualRow.index,
      size: virtualRow.size,
      start: virtualRow.start
    })),
    totalSize: rowVirtualizer.getTotalSize(),
    scrollTo: rowVirtualizer.scrollToIndex
  }), [virtualRows, data, rowVirtualizer]);

  return {
    virtualData: memoizedData,
    parentRef: containerRefCallback,
    isLoading,
    loadMoreItems
  };
}; 