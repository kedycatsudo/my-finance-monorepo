const nextConfig = {
  //output: 'export',
  images: { unoptimized: true },
  basePath: '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  reactCompiler: true,
};

export default nextConfig;
