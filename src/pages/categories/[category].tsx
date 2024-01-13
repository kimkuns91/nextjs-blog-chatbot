import PostList from '@/components/PostList';
import { GetServerSideProps } from 'next';

type CategoryPostProps = {
  category: string;
};

export default function CategoryPosts({ category }: CategoryPostProps) {
  return <PostList category={category} />;
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
