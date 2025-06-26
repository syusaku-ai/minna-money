import { createClient } from '@supabase/supabase-js';

// 環境変数の代わりに直接埋め込む（動作確認用）
const supabaseUrl     = 'https://ztdqeebfaexegqyqmgyb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZHFlZWJmYWV4ZWdxeXFtZ3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjgyNzEsImV4cCI6MjA2NjI0NDI3MX0.CC8HAiKfO7Iw6y2-_JfLJ4NqMzmKOfVecGnBWAJA0Kw';

console.log('🛠️ SUPABASE_URL=', supabaseUrl);
console.log('🛠️ SUPABASE_ANON_KEY=', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
