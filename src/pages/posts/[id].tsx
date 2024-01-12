import { MarkdownViewer } from '@/components/Markdown';
import { Post } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

type PostProps = Post;

export default function Post({
  id,
  title,
  category,
  tags,
  content,
  created_at,
  preview_image_url,
}: PostProps) {
  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 pb-40 pt-20">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="flex flex-row items-center gap-2">
        <Link
          href={`/categories/${category}`}
          className="rounded-md bg-slate-800 px-2 py-1 text-sm text-white"
        >
          {category}
        </Link>
        {tags.map((tag) => (
          <Link
            href={`/tags/${tag}`}
            key={tag}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500"
          >
            {tag}
          </Link>
        ))}
        <div className="text-sm text-gray-500">
          {format(new Date(created_at), 'yyyy년 M월 d일 HH:mm')}
        </div>
      </div>
      {preview_image_url && (
        <Image
          src={preview_image_url}
          width={0}
          height={0}
          sizes="100vw"
          alt={title}
          className="h-auto w-full"
        />
      )}
      <MarkdownViewer source={content} className="min-w-full" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { id } = query;

  const supabase = createClient(req.cookies);

  const { data } = await supabase.from('Post').select('*').eq('id', Number(id));
  if (!data || !data[0]) return { notFound: true };

  const { title, category, tags, content, created_at, preview_image_url } =
    data[0];

  return {
    props: {
      title,
      category,
      tags: JSON.parse(tags),
      content,
      created_at,
      preview_image_url,
    },
  };
};
