import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      // Get post count for each category
      const categoriesWithCount = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);
          
          return {
            ...category,
            post_count: count || 0
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'post_count'>) => {
    try {
      // Only send allowed fields
      const { name, description, color, parent_id } = categoryData;
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const safeCategoryData = {
        name,
        slug,
        description,
        color,
        parent_id: parent_id ? parent_id : null
      };
      const { data, error } = await supabase
        .from('categories')
        .insert([safeCategoryData])
        .select()
        .single();

      if (error) throw error;

      await fetchCategories(); // Refresh the list
      return { success: true, data };
    } catch (err) {
      console.error('Supabase createCategory error:', err, JSON.stringify(err));
      return { success: false, error: typeof err === 'object' ? JSON.stringify(err) : String(err) };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      // Only send allowed fields
      const { name, description, color, parent_id } = updates;
      const safeUpdates: any = {
        description,
        color,
        parent_id: parent_id ? parent_id : null
      };
      // If name is being updated, also update slug
      if (name) {
        safeUpdates.name = name;
        safeUpdates.slug = name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      const { data, error } = await supabase
        .from('categories')
        .update(safeUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchCategories(); // Refresh the list
      return { success: true, data };
    } catch (err) {
      return { success: false, error: typeof err === 'object' ? JSON.stringify(err) : String(err) };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCategories(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete category' };
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};