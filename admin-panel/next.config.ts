import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['tslib'] = 'tslib/tslib.es6.js';
    return config;
  },
  turbopack: {},
};

export default nextConfig;
