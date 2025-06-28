// components/Header.tsx
'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <h1 className="text-xl font-bold text-gray-900">
        みんなのマネー帳
      </h1>
      <nav className="flex items-center space-x-4">
        <Link href="/reviews" className="text-gray-700">
          レビュー一覧
        </Link>
        <Link href="/reviews/new" className="text-gray-700">
          新規投稿
        </Link>
        <Link href="/signup" className="text-gray-700">
          サインアップ
        </Link>
        <Link href="/login" className="text-gray-700">
          ログイン
        </Link>
        <Link href="/profile" className="text-gray-700">
          マイページ
        </Link>
      </nav>
    </header>
  );
}
