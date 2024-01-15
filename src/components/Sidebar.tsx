import { useCategories } from '@/utils/hooks';
import { cn } from '@/utils/style';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { FC } from 'react';
import { AiFillGithub, AiFillInstagram, AiOutlineClose } from 'react-icons/ai';
import IconButton from './IconButton';

type SidebarProps = {
  close: () => void;
  isOpen: boolean;
};

const supabase = createClient();

const Sidebar: FC<SidebarProps> = ({ close, isOpen }) => {
  const { data: existingCategories } = useCategories();

  return (
    <div
      className={cn(
        'absolute z-10 min-h-screen flex-col gap-6 border-r bg-white p-10 pr-6 text-base lg:relative',
        isOpen ? 'flex' : 'hidden',
      )}
    >
      <div className="flex justify-end lg:hidden">
        <IconButton icon={AiOutlineClose} onClick={close} />
      </div>
      <Link href="/" className="w-48 font-medium text-gray-600 hover:underline">
        홈
      </Link>
      <Link
        href="/tags"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        태그
      </Link>
      {existingCategories?.map((category) => (
        <Link
          href={`/category/${category}`}
          className="w-48 font-medium text-gray-600 hover:underline"
          key={category}
        >
          {category}
        </Link>
      ))}
      <Link
        href="/category/Web-Development"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        Web Development
      </Link>
      <div className="mt-10 flex items-center gap-4">
        <IconButton
          icon={AiFillInstagram}
          component={Link}
          href="https://www.instagram.com/kimkuns98"
          target="_blank"
        />
        <IconButton
          icon={AiFillGithub}
          component={Link}
          href="https://github.com/kimkuns91"
          target="_blank"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fnextjs-blog-chatbot.vercel.app&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%EB%B0%A9%EB%AC%B8%EC%9E%90&edge_flat=false"
          alt="방문자 뱃지"
        />
      </div>
    </div>
  );
};

export default Sidebar;
