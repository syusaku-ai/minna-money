// app/layout.tsx
import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'みんなのマネー帳',
  description: '金融サービスレビューサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body className="bg-white text-gray-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
