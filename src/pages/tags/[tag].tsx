import PostList from '@/components/PostList';
import { createClient } from '@/utils/supabase/client';
import { GetServerSideProps } from 'next';

type TagPostProps = {
  tag: string;
};

const supabase = createClient();

export default function TagPosts({ tag }: TagPostProps) {
  return <PostList tag={tag} />;
}

export const getServerSideProps: GetServerSideProps<TagPostProps> = async ({
  query,
}) => {
  return {
    props: {
      tag: query.tag as string,
    },
  };
};
