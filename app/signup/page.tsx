'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      alert('エラー: ' + error.message);
    } else {
      alert('確認メールを送信しました。メール内のリンクからアカウントを有効化してください。');
      router.push('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">サインアップ</h1>

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
        onClick={handleSignUp}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? '送信中…' : 'サインアップ'}
      </button>
    </div>
  );
}
