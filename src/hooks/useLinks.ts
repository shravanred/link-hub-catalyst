import { useState, useEffect } from 'react';
import { AffiliateLink, Category } from '@/types';

const LINKS_KEY = 'linkHub_links';
const CATEGORIES_KEY = 'linkHub_categories';

// Default data
const defaultCategories: Category[] = [
  { id: '1', name: 'Mobiles', createdAt: new Date() },
  { id: '2', name: 'Fashion', createdAt: new Date() },
  { id: '3', name: 'Electronics', createdAt: new Date() },
];

const defaultLinks: AffiliateLink[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro',
    url: 'https://example.com/iphone15',
    category: 'Mobiles',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
    description: 'Latest iPhone with amazing features',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
  },
  {
    id: '2',
    title: 'Nike Air Max',
    url: 'https://example.com/nike-air-max',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    description: 'Comfortable and stylish sneakers',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
  },
];

export const useLinks = () => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem(LINKS_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);

    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      setLinks(defaultLinks);
      localStorage.setItem(LINKS_KEY, JSON.stringify(defaultLinks));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }
  }, []);

  const saveLinks = (newLinks: AffiliateLink[]) => {
    setLinks(newLinks);
    localStorage.setItem(LINKS_KEY, JSON.stringify(newLinks));
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
  };

  const addLink = (link: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const categoryLinks = links.filter(l => l.category === link.category);
    const newLink: AffiliateLink = {
      ...link,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: categoryLinks.length + 1,
    };
    saveLinks([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<AffiliateLink>) => {
    const updatedLinks = links.map(link =>
      link.id === id ? { ...link, ...updates, updatedAt: new Date() } : link
    );
    saveLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
    };
    saveCategories([...categories, newCategory]);
  };

  const deleteCategory = (categoryName: string) => {
    // Delete all links in this category first
    const updatedLinks = links.filter(link => link.category !== categoryName);
    saveLinks(updatedLinks);
    
    // Then delete the category
    const updatedCategories = categories.filter(cat => cat.name !== categoryName);
    saveCategories(updatedCategories);
  };

  const reorderLinks = (categoryName: string, reorderedLinks: AffiliateLink[]) => {
    const otherLinks = links.filter(link => link.category !== categoryName);
    const updatedLinks = [...otherLinks, ...reorderedLinks];
    saveLinks(updatedLinks);
  };

  return {
    links,
    categories,
    addLink,
    updateLink,
    deleteLink,
    addCategory,
    deleteCategory,
    reorderLinks,
  };
};