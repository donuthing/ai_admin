import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  //   output: "export",
  // basePath: "/ai_admin",
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    turbopack: false,
  } as any,
  // @ts-ignore
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
