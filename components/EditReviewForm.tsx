// components/EditReviewForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

type Review = {
  id: string;
  title: string;
  background: string;
  pros: string;
  cons: string;
  result: string;
  rating: number;
  tags: string[];
};

type Props = { review: Review };

export default function EditReviewForm({ review }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(review.title);
  const [background, setBackground] = useState(review.background);
  const [pros, setPros] = useState(review.pros);
  const [cons, setCons] = useState(review.cons);
  const [result, setResult] = useState(review.result);
  const [rating, setRating] = useState(review.rating);
  const [tags, setTags] = useState(review.tags.join(','));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const { error } = await supabase
      .from('reviews')
      .update({
        title,
        background,
        pros,
        cons,
        result,
        rating,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
      })
      .eq('id', review.id);

    if (error) {
      setErrorMessage(`更新に失敗しました: ${error.message}`);
    } else {
      router.push(`/reviews/${review.id}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当にこのレビューと関連コメントを削除しますか？')) return;
    setErrorMessage(null);

    // 1. 関連コメントを先に削除
    const { error: delCommentsError } = await supabase
      .from('comments')
      .delete()
      .eq('review_id', review.id);

    if (delCommentsError) {
      setErrorMessage(`関連コメントの削除に失敗しました: ${delCommentsError.message}`);
      return;
    }

    // 2. レビュー本体を削除
    const { error: delReviewError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review.id);

    if (delReviewError) {
      setErrorMessage(`レビューの削除に失敗しました: ${delReviewError.message}`);
    } else {
      router.push('/reviews');
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold">レビュー編集</h2>

      {errorMessage && (
        <div className="p-2 mb-4 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">背景</label>
          <textarea
            value={background}
            onChange={e => setBackground(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">良かった点</label>
          <textarea
            value={pros}
            onChange={e => setPros(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">悪かった点</label>
          <textarea
            value={cons}
            onChange={e => setCons(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">結果</label>
          <textarea
            value={result}
            onChange={e => setResult(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">評価 (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block mb-1">タグ（カンマ区切り）</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            更新する
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            削除する
          </button>
        </div>
      </form>
    </div>
  );
}
