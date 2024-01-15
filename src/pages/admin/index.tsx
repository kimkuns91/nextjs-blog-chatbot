import Button from '@/components/Button';
import Input from '@/components/Input';
import { createClient } from '@/utils/supabase/client';
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const supabase = createClient();

export default function Admin() {
  const router = useRouter();
  const [userResponse, setUserResponse] = useState<UserResponse>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await supabase.auth.signInWithPassword({
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    });

    if (!response.data.user) {
      return alert('로그인에 실패했습니다.');
    }

    router.refresh();
  };

  useEffect(() => {
    (async () => {
      const user = await supabase.auth.getUser();
      setUserResponse(user);
    })();
  }, []);

  return (
    <div className="container flex flex-col pb-20 pt-12">
      {!!userResponse?.data.user ? (
        <div className="flex flex-col gap-2">
          <div className="mb-8">
            <b>{userResponse?.data.user.email}</b>님으로 로그인하셨습니다.
          </div>
          <Button type="button" onClick={() => router.push('/write')}>
            글 쓰러 가기
          </Button>
          <Button
            type="button"
            onClick={() => {
              supabase.auth.signOut();
              router.push('/');
            }}
          >
            로그아웃
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium">관리자 로그인</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <Input type="text" placeholder="이메일" ref={emailRef} />
              <Input type="password" placeholder="비밀번호" ref={passwordRef} />
            </div>
            <Button
              type="submit"
              className="mt-4"
              onClick={() => router.push('/write')}
            >
              로그인
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
