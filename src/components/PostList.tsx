import { createClient } from '@/utils/supabase/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

const supabase = createClient();

type PostListProps = {
  category?: string;
  tag?: string;
  className?: string;
};

const PostList: FC<PostListProps> = ({ category, tag, className }) => {
  const { ref, inView } = useInView();

  const {
    data: postPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      let request = supabase.from('Post').select('*');
      const { data } = await supabase
        .from('Post')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + 4);
      if (!data)
        return {
          posts: [],
          nextPage: null,
        };
      return {
        posts: data,
        nextPage: data.length === 5 ? pageParam + 5 : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
export default PostList;
