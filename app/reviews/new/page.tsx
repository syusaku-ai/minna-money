'use client';

import Protected from '../../../components/Protected';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function NewReviewPage() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState('');
  const [background, setBackground] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [result, setResult] = useState('');
  const [rating, setRating] = useState<number>(1);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

    const { error } = await supabase
      .from('reviews')
      .insert([{
        user_id: user?.id,
        service_name: serviceName,
        background,
        pros,
        cons,
        result,
        rating,
        tags: tagArray,
      }]);

    setLoading(false);
    if (error) {
      alert('投稿失敗: ' + error.message);
    } else {
      alert('投稿が完了しました！');
      router.push('/reviews');
    }
  };

  return (
    <Protected>
      <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-3xl font-bold mb-6">新しいレビューを投稿</h1>

        <label className="block text-lg font-medium mb-2">サービス名</label>
        <input
          type="text"
          value={serviceName}
          onChange={e => setServiceName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <label className="block text-lg font-medium mb-2">利用背景</label>
        <textarea
          value={background}
          onChange={e => setBackground(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">良かった点</label>
        <textarea
          value={pros}
          onChange={e => setPros(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">悪かった点</label>
        <textarea
          value={cons}
          onChange={e => setCons(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">結果</label>
        <textarea
          value={result}
          onChange={e => setResult(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
        />

        <label className="block text-lg font-medium mb-2">評価</label>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              onClick={() => setRating(i)}
              className={`cursor-pointer text-2xl mr-1 ${
                rating >= i ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              {rating >= i ? '★' : '☆'}
            </span>
          ))}
        </div>

        <label className="block text-lg font-medium mb-2">タグ (カンマ区切り)</label>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? '送信中…' : '投稿する'}
        </button>
      </div>
    </Protected>
  );
}
