'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center">
      <h1 className="text-xl font-bold">
        <Link href="/" className="hover:underline">
          みんなのマネー帳
        </Link>
      </h1>
      <nav className="ml-auto flex space-x-4">
        <Link href="/reviews" className="hover:underline">
          レビュー一覧
        </Link>
        {session ? (
          <>
            <Link href="/reviews/new" className="hover:underline">
              新規投稿
            </Link>
            <Link href="/profile" className="hover:underline">
              マイページ
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" className="hover:underline">
              サインアップ
            </Link>
            <Link href="/login" className="hover:underline">
              ログイン
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
