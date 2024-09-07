import * as path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: function (config) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    config.resolve.alias = {
      ...config.resolve.alias,
      "@phrases": path.resolve(__dirname, "./src/phrases"),
    };

    return config
  },

  experimental: {
    staleTimes: {
      static: 0,
      dynamic: 0,
    }
  },

  async rewrites() {
    return{
      afterFiles: [
        {
          source: "/:path((?!en|api).*)",
          destination: "/no/:path*",
        },
      ],
    }
  },

  transpilePackages: ["@enonic/nextjs-adapter"],
};

export default nextConfig;
