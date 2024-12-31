import React from 'react';
import { Category } from '../types/category';
import { ExternalLink } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="aspect-video relative">
        <img
          src={category.photoURL}
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            category.activeStatus === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {category.activeStatus}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">ID: {category.id}</span>
          <ExternalLink className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};