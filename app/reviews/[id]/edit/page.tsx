'use client';

import Protected   from '@/components/Protected';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Review = {
  id: string;
  user_id: string;
  service_name: string;
  background: string;
  pros: string;
  cons: string;
  result: string;
  rating: number;
  tags: string[];
  created_at: string;
};

export default function ReviewDetailPage() {
  const { id } = useParams()!;
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('レビュー取得エラー:', error.message);
      } else if (data) {
        setReview(data as Review);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-center p-5">読み込み中…</p>;
  if (!review) return <p className="text-center">レビューが見つかりません。</p>;

  return (
    <Protected>
      <div className="max-w-2xl mx-auto p-5 space-y-4">
        <h1 className="text-2xl font-bold">{review.service_name}</h1>
        <p className="text-sm text-gray-500">投稿日: {new Date(review.created_at).toLocaleString()}</p>

        <div>
          <h2 className="font-semibold">背景</h2>
          <p>{review.background}</p>
        </div>
        <div>
          <h2 className="font-semibold">良かった点</h2>
          <p>{review.pros}</p>
        </div>
        <div>
          <h2 className="font-semibold">悪かった点</h2>
          <p>{review.cons}</p>
        </div>
        <div>
          <h2 className="font-semibold">結果</h2>
          <p>{review.result}</p>
        </div>
        <div>
          <h2 className="font-semibold">評価</h2>
          <p>{review.rating} / 5</p>
        </div>
        {review.tags.length > 0 && (
          <div>
            <h2 className="font-semibold">タグ</h2>
            <p>{review.tags.join(', ')}</p>
          </div>
        )}

        <div className="flex space-x-4 mt-4">
          <Link href={`/reviews/${review.id}/edit`} className="text-blue-500 hover:underline">
            編集
          </Link>
          <button
            className="text-red-500 hover:underline"
            onClick={async () => {
              if (confirm('本当に削除しますか？')) {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (!error) router.push('/reviews');
              }
            }}
          >
            削除
          </button>
        </div>
      </div>
    </Protected>
  );
}
