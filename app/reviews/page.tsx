'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Review = {
  id: string;
  service_name: string;
  rating: number;
  tags: string[];
  created_at: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from<Review>('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      setReviews(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = reviews.filter(r => {
    const byKeyword = r.service_name.includes(keyword);
    const tags = r.tags.join(',');
    const byTag = tagFilter ? tags.includes(tagFilter) : true;
    return byKeyword && byTag;
  });

  if (loading) return <p className="p-5 text-center">読み込み中…</p>;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-4xl font-bold mb-6">レビュー一覧</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="キーワードで検索"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="タグで絞り込み (例: 初心者)"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded p-2"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">該当するレビューがありません。</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map(r => (
            <li
              key={r.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Link href={`/reviews/${r.id}`} className="block">
                <h2 className="text-2xl font-semibold mb-1">{r.service_name}</h2>
              </Link>
              <p className="mb-1"><span className="font-semibold">評価:</span> {r.rating} / 5</p>
              <p className="mb-2"><span className="font-semibold">タグ:</span> {r.tags.join(', ')}</p>
              <p className="text-sm text-gray-500">投稿日: {new Date(r.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
