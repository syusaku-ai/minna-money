'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert('ログイン失敗: ' + error.message);
    } else {
      alert('ログイン成功');
      router.push('/reviews');
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>

      <label className="block text-lg font-medium mb-2">メールアドレス</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      <label className="block text-lg font-medium mb-2">パスワード</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-6"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? 'ログイン中…' : 'ログイン'}
      </button>

      <p className="mt-4 text-center text-sm">
        まだアカウントがない方は{' '}
        <Link href="/signup" className="text-blue-600 underline">
          サインアップ
        </Link>
      </p>
    </div>
  );
}
