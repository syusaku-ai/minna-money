'use client';

import Protected from '../../../../components/Protected';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

type Review = {
  id: string;
  service_name: string;
  background: string;
  pros: string;
  cons: string;
  result: string;
  rating: number;
  tags: string[];
};

export default function EditReviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm] = useState<Review>({
    id: '',
    service_name: '',
    background: '',
    pros: '',
    cons: '',
    result: '',
    rating: 1,
    tags: [],
  });
  const [tagsText, setTagsText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from<Review>('reviews')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        alert('レビューが見つかりませんでした');
        router.push('/reviews');
        return;
      }
      setForm(data);
      setTagsText(data.tags.join(','));
      setLoading(false);
    })();
  }, [id, router]);

  const handleUpdate = async () => {
    setLoading(true);
    const tagArray = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase
      .from('reviews')
      .update({
        service_name: form.service_name,
        background: form.background,
        pros: form.pros,
        cons: form.cons,
        result: form.result,
        rating: form.rating,
        tags: tagArray,
      })
      .eq('id', id);
    setLoading(false);
    if (error) {
      alert('更新失敗: ' + error.message);
    } else {
      alert('レビューを更新しました');
      router.push(`/reviews/${id}`);
    }
  };

  if (loading) {
    return <p className="p-5 text-center">読み込み中…</p>;
  }

  return (
    <Protected>
      <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-3xl font-bold mb-6">レビューを編集</h1>

        <label className="block text-lg font-medium mb-2">サービス名</label>
        <input
          type="text"
          value={form.service_name}
          onChange={e => setForm({ ...form, service_name: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <label className="block text-lg font-medium mb-2">利用背景</label>
        <textarea
          value={form.background}
          onChange={e => setForm({ ...form, background: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">良かった点</label>
        <textarea
          value={form.pros}
          onChange={e => setForm({ ...form, pros: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">悪かった点</label>
        <textarea
          value={form.cons}
          onChange={e => setForm({ ...form, cons: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">結果</label>
        <textarea
          value={form.result}
          onChange={e => setForm({ ...form, result: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">評価</label>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              onClick={() => setForm({ ...form, rating: i })}
              className={`cursor-pointer text-2xl mr-1 ${
                form.rating >= i ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              {form.rating >= i ? '★' : '☆'}
            </span>
          ))}
        </div>

        <label className="block text-lg font-medium mb-2">タグ (カンマ区切り)</label>
        <input
          type="text"
          value={tagsText}
          onChange={e => setTagsText(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-6"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? '更新中…' : '更新する'}
        </button>
      </div>
    </Protected>
  );
}
