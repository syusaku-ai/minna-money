// app/reviews/page.tsx

import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Review = {
  id: string;
  service_name: string | null;
  created_at: string;
};

export default async function ReviewsPage() {
  // サーバーサイドで id, service_name, created_at を取得
  const { data: reviews, error } = await supabase
    .from<Review>('reviews')
    .select('id, service_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <p className="p-4 text-red-600">
        レビューの読み込み中にエラーが発生しました: {error.message}
      </p>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <p className="p-4">まだ投稿されたレビューはありません。</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">レビュー一覧</h1>
      {reviews.map((r) => (
        <Link
          key={r.id}
          href={`/reviews/${r.id}/edit`}
          className="block border rounded-lg p-4 mb-4 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            {r.service_name?.trim() || '（サービス名未設定）'}
          </h2>
          <p className="text-sm text-gray-600">
            投稿日: {new Date(r.created_at).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
