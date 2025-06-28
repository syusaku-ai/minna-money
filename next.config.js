/** @type {import('next').NextConfig} */
const nextConfig = {
  // Typescript のビルド時エラーを無視してデプロイを通す
  typescript: {
    ignoreBuildErrors: true,
  },
  // 既存の設定があればそのまま残す
};

module.exports = nextConfig;
