/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["files.edgestore.dev"],
  },
  // Disable terminal editor integration
  env: {
    REACT_EDITOR: "none",
  },
};

module.exports = nextConfig;
