import PostCard from '@/components/PostCard';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

type CategoryPostProps = {
  category: string;
};

const supabase = createClient();

export default function CategoryPosts({ category }: CategoryPostProps) {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      if (!data) return [];
      return data;
    },
  });
  return (
    <div className="flex flex-col items-center gap-8 pt-20">
      <h1 className="text-2xl font-medium"># {category}</h1>
      <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 pt-20 lg:gap-x-7 lg:gap-y-12">
        {posts?.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  CategoryPostProps
> = async ({ query }) => {
  return {
    props: {
      category: query.category as string,
    },
  };
};
