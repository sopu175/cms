import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Media } from '../types';

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setMedia(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const uploadMedia = async (file: File, folder: string = 'uploads') => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated to upload media');

      // Upload to Supabase Storage
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media-bucket')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('media-bucket')
        .getPublicUrl(filePath);

      const url = publicUrlData.publicUrl;

      // Save to media table
      const { data, error } = await supabase
        .from('media')
        .insert([{
          filename: `${Date.now()}-${file.name}`,
          original_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          url: url,
          folder: folder,
          uploaded_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchMedia();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to upload media' };
    }
  };

  const updateMedia = async (id: string, updates: Partial<Media>) => {
    try {
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchMedia();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update media' };
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMedia();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete media' };
    }
  };

  return {
    media,
    loading,
    error,
    uploadMedia,
    updateMedia,
    deleteMedia,
    refetch: fetchMedia
  };
};