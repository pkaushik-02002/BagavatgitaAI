const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Fix CSS modules compilation warning
    const rules = config.module.rules
    const cssModuleRule = rules.find((rule) => rule.oneOf)
    if (cssModuleRule) {
      const cssLoader = cssModuleRule.oneOf.find(
        (rule) => rule.sideEffects === false
      )
      if (cssLoader) {
        cssLoader.issuer = { not: /\.(css|scss|sass)$/ }
      }
    }

    return config
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    serverActions: true,
  },
}

export default nextConfig
