'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

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

type Comment = {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export default function ReviewDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingLoading, setEditingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // レビュー取得
      const { data: reviewData, error: reviewError } = await supabase
        .from<Review>('reviews')
        .select('*')
        .eq('id', id)
        .single();
      if (reviewError || !reviewData) {
        alert('レビューが見つかりませんでした');
        router.push('/reviews');
        return;
      }
      setReview(reviewData);
      // コメント取得
      const { data: commentsData } = await supabase
        .from<Comment>('comments')
        .select('*')
        .eq('review_id', id)
        .order('created_at', { ascending: false });
      setComments(commentsData || []);
      setLoading(false);
    })();
  }, [id, router]);

  const handleDeleteReview = async () => {
    if (!confirm('本当にこのレビューを削除しますか？')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      alert('削除失敗: ' + error.message);
    } else {
      router.push('/reviews');
    }
  };

  const handleEditReview = () => {
    router.push(`/reviews/${id}/edit`);
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    setCommentLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('comments')
      .insert({ review_id: id, user_id: user?.id, content: commentContent });
    setCommentContent('');
    const { data: newComments } = await supabase
      .from<Comment>('comments')
      .select('*')
      .eq('review_id', id)
      .order('created_at', { ascending: false });
    setComments(newComments || []);
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('このコメントを削除しますか？')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId) return;
    setEditingLoading(true);
    await supabase
      .from('comments')
      .update({ content: editingContent })
      .eq('id', editingCommentId);
    setComments(prev =>
      prev.map(c =>
        c.id === editingCommentId ? { ...c, content: editingContent } : c
      )
    );
    setEditingCommentId(null);
    setEditingContent('');
    setEditingLoading(false);
  };

  if (loading || !review) {
    return <p className="p-5">読み込み中…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{review.service_name}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleEditReview}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            編集
          </button>
          <button
            onClick={handleDeleteReview}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            削除
          </button>
        </div>
      </div>

      <p className="mb-2"><span className="font-semibold">評価:</span> {review.rating} / 5</p>
      <p className="mb-2"><span className="font-semibold">利用背景:</span> {review.background}</p>
      <p className="mb-2"><span className="font-semibold">良かった点:</span> {review.pros}</p>
      <p className="mb-2"><span className="font-semibold">悪かった点:</span> {review.cons}</p>
      <p className="mb-2"><span className="font-semibold">結果:</span> {review.result}</p>
      <p className="mb-2"><span className="font-semibold">タグ:</span> {review.tags.join(', ')}</p>
      <p className="text-sm text-gray-500 mb-6">投稿日: {new Date(review.created_at).toLocaleString()}</p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">コメント</h2>
        <textarea
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded p-2 mb-3"
          placeholder="コメントを入力"
        />
        <button
          onClick={handleCommentSubmit}
          disabled={commentLoading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-6"
        >
          {commentLoading ? '送信中…' : 'コメントを投稿'}
        </button>

        {comments.length === 0 ? (
          <p>まだコメントがありません。</p>
        ) : (
          <ul className="space-y-4">
            {comments.map(c => (
              <li key={c.id} className="border-b border-gray-200 pb-4">
                {editingCommentId === c.id ? (
                  <>
                    <textarea
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateComment}
                        disabled={editingLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        {editingLoading ? '更新中…' : '保存'}
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                      >
                        キャンセル
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-1">{c.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{new Date(c.created_at).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingCommentId(c.id); setEditingContent(c.content); }}
                        className="text-blue-600 hover:underline"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
