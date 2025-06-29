// app/layout.tsx
import './globals.css';
import Providers from '../components/Providers';
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
      <head>
        {/* Google Search Console 所有権確認用メタタグ */}
        <meta
          name="google-site-verification"
          content="LFCiVOaqe48rgRQjKt7s_yM4UQ9qVOwtlZO48Yr4zPA"
        />
      </head>
      <body className="bg-white text-gray-900">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
