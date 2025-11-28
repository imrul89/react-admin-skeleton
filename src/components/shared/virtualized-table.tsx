import React, { useMemo, useCallback } from 'react';
import { List, useListRef } from 'react-window';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import './virtualized-table.css';

interface VirtualizedTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string | ((record: T, index: number) => React.Key);
  rowHeight?: number;
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
  className?: string;
}

const VirtualizedTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey: _rowKey,
  rowHeight = 54,
  scroll,
  size = 'small',
  style,
  className = ''
}: VirtualizedTableProps<T>) => {
  const listRef = useListRef();

  const scrollHeight = useMemo(() => {
    if (!scroll?.y) return 600;
    return typeof scroll.y === 'number' ? scroll.y : parseInt(scroll.y.toString());
  }, [scroll?.y]);

  const scrollWidth = useMemo(() => {
    if (!scroll?.x) {
      return columns.reduce((sum, col) => {
        const width = typeof col.width === 'number' ? col.width : 150;
        return sum + width;
      }, 0);
    }
    return typeof scroll.x === 'number' ? scroll.x : parseInt(scroll.x.toString());
  }, [scroll?.x, columns]);

  const columnWidths = useMemo(() => {
    return columns.map(col => {
      if (typeof col.width === 'number') return col.width;
      if (typeof col.width === 'string') return parseInt(col.width);
      return 150;
    });
  }, [columns]);

  const paddingSize = size === 'small' ? 8 : size === 'middle' ? 12 : 16;

  const Row = useCallback(({ index }: { index: number }) => {
    const record = dataSource[index];
    if (!record) {
      return <div style={{ height: rowHeight }} />;
    }

    return (
      <div
        className="virtualized-table-row"
        style={{
          display: 'flex',
          borderBottom: '1px solid #f0f0f0',
          alignItems: 'center',
          padding: `${paddingSize}px 0`,
          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
          height: rowHeight
        }}
      >
        {columns.map((col, colIndex) => {
          const colWidth = columnWidths[colIndex];
          const column = col as ColumnType<T>;
          const cellValue = column.dataIndex
            ? (Array.isArray(column.dataIndex)
                ? column.dataIndex.reduce((obj: any, key: string) => obj?.[key], record)
                : record[column.dataIndex as string])
            : null;

          return (
            <div
              key={column.key || colIndex}
              className="virtualized-table-cell"
              style={{
                width: colWidth,
                minWidth: colWidth,
                padding: `0 ${paddingSize}px`,
                textAlign: column.align || 'left',
                overflow: 'hidden'
              }}
            >
              {column.render ? column.render(cellValue, record, index) : (cellValue ?? '')}
            </div>
          );
        })}
      </div>
    );
  }, [dataSource, columns, columnWidths, paddingSize, rowHeight]);

  return (
    <div 
      className={`virtualized-table-container ${className}`}
      style={{ 
        position: 'relative',
        border: '1px solid #f0f0f0',
        borderRadius: '6px',
        overflow: 'hidden',
        ...style 
      }}
    >
      {/* Table Header */}
      <div
        className="virtualized-table-header"
        style={{
          display: 'flex',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          fontWeight: 600,
          padding: `${paddingSize}px 0`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: scrollWidth
        }}
      >
        {columns.map((col, index) => {
          const colWidth = columnWidths[index];
          const column = col as ColumnType<T>;
          const title = typeof column.title === 'function' ? column.title({}) : column.title;
          return (
            <div
              key={column.key || index}
              className="virtualized-table-header-cell"
              style={{
                width: colWidth,
                minWidth: colWidth,
                padding: `0 ${paddingSize}px`,
                textAlign: column.align || 'left',
                fontSize: size === 'small' ? '12px' : size === 'middle' ? '14px' : '16px'
              }}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* Virtualized Body */}
      <div style={{ width: scrollWidth, overflowX: 'auto', height: scrollHeight - (paddingSize * 2 + 1) }}>
        <List
          listRef={listRef as any}
          rowComponent={Row}
          rowCount={dataSource.length}
          rowHeight={rowHeight}
          defaultHeight={scrollHeight - (paddingSize * 2 + 1)}
          rowProps={{ index: 0 } as any}
        />
      </div>
    </div>
  );
};

export default VirtualizedTable;

