import { useQuery } from '@tanstack/react-query';
import { createClient } from './supabase/client';

const supabase = createClient();

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('category');
      return Array.from(new Set(data?.map((d) => d.category)));
    },
  });

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('tags');
      return Array.from(new Set(data?.flatMap((d) => JSON.parse(d.tags))));
    },
  });
