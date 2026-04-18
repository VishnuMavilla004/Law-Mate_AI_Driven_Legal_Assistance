import React from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark
            ${selectedCategory === category
              ? 'bg-primary-dark text-white border-primary-dark shadow-lg shadow-blue-500/30'
              : 'bg-surface text-text-secondary border-border hover:border-primary-dark hover:text-primary-dark'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};