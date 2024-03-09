/** @type {import('next').NextConfig} */
const nextConfig = {
  env:{
    NEXT_PUBLIC_VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    NEXT_PUBLIC_VERCEL_ARTIFACTS_TOKEN: process.env.VERCEL_ARTIFACTS_TOKEN
  }
}

export default nextConfig;
