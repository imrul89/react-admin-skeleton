import { useState } from 'react';

const ALL_KEYS = [
  'line-item',
  'buyer-settings',
  'templates',
  'basic-settings',
  'date',
  'budget',
  'frequency',
  'advanced-settings',
  'metadata',
  'targeting',
  'inventory',
  'comments',
  'creatives',
  'creative-assets',
  'creative-tracking',
  'creative-settings',
  'pgt-tag'
];

export const useCollapse = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>(ALL_KEYS);

  const handleToggleCollapse = () => {
    if (activeKeys.length === 0) {
      setActiveKeys(ALL_KEYS);
    } else {
      setActiveKeys([]);
    }
  };

  return {
    activeKeys,
    setActiveKeys,
    handleToggleCollapse
  };
};