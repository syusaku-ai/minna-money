// app/reviews/[id]/edit/page.tsx

import { supabase } from '../../../../lib/supabaseClient';
import EditReviewForm from '../../../../components/EditReviewForm';

type Params = { params: { id: string } };

export default async function EditPage({ params }: Params) {
  // サーバーサイドでレビューを取得
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !review) {
    return (
      <p className="p-4 text-red-600">
        レビューが見つかりませんでした。
      </p>
    );
  }

  // クライアント用フォームに渡す
  return <EditReviewForm review={review} />;
}
