/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      // Add the Azure Blob / Front Door CDN host here once content images
      // (event photos, partner logos) move off Squarespace, e.g.:
      // { protocol: "https", hostname: "fabric-belgium-assets-xxxx.z01.azurefd.net" },
    ],
  },
};

module.exports = nextConfig;
