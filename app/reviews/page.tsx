'use client';

import Protected from '@/components/Protected';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// レビュー一覧表示用の型定義
type ReviewSummary = {
  id: string;
  service_name: string;
  rating: number;
  created_at: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 全レビューを取得（降順）
      const { data, error } = await supabase
        .from('reviews')
        .select('id, service_name, rating, created_at')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('レビュー一覧取得エラー:', error.message);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Protected>
      <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-3xl font-bold mb-6">レビュー一覧</h1>
        {loading ? (
          <p className="text-center p-5">読み込み中…</p>
        ) : reviews.length === 0 ? (
          <p className="text-center">まだレビューが投稿されていません。</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <Link href={`/reviews/${r.id}`} className="text-xl font-semibold hover:underline">
                  {r.service_name}
                </Link>
                <p className="mt-1"><span className="font-semibold">評価:</span> {r.rating} / 5</p>
                <p className="text-sm text-gray-500">投稿日: {new Date(r.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Protected>
  );
}
