/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: false,
  },

  // Image optimization - disabled for Netlify compatibility
  images: {
    unoptimized: true,
    domains: ['my.spline.design', 'prod.spline.design'],
  },

  // Transpile packages for better compatibility
  transpilePackages: ['framer-motion'],

  // Output configuration for Netlify
  // output: 'export', // Disabled for Netlify plugin compatibility

  // Trailing slash configuration
  trailingSlash: false,

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Framer Motion optimization
    config.module.rules.push({
      test: /framer-motion/,
      sideEffects: false
    })

    // Audio file handling
    config.module.rules.push({
      test: /\.(mp3|wav|m4a)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/audio/[name].[hash][ext]'
      }
    })

    // Font file handling
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash][ext]'
      }
    })

    // Enhanced chunk loading configuration with better error handling
    if (!isServer) {
      // Optimize chunk splitting for better loading reliability
      config.optimization = {
        ...config.optimization,
        // Ensure consistent module IDs
        moduleIds: dev ? 'named' : 'deterministic',
        chunkIds: dev ? 'named' : 'deterministic',
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Create a separate chunk for green components
            greenComponents: {
              test: /[\\/]app[\\/]green[\\/]components[\\/]/,
              name: 'green-components',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate chunk for animations to prevent conflicts
            animations: {
              test: /[\\/]components[\\/]animations[\\/]/,
              name: 'animations',
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Vendor chunk for external libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            }
          }
        }
      }

      // Enhanced output configuration with better chunk naming
      config.output = {
        ...config.output,
        // Use more reliable chunk naming strategy
        chunkFilename: dev
          ? 'static/chunks/[name].js'
          : 'static/chunks/[name].[contenthash:8].js',
        // Add crossOriginLoading for better error handling
        crossOriginLoading: 'anonymous',
        // Ensure consistent public path
        publicPath: '/_next/',
        // Add chunk loading timeout
        chunkLoadTimeout: 30000,
      }

      // Add chunk loading error handling
      config.plugins = config.plugins || [];
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.thisCompilation.tap('ChunkErrorPlugin', (compilation) => {
            compilation.hooks.chunkAsset.tap('ChunkErrorPlugin', (chunk, filename) => {
              // Ensure chunk has a valid hash
              if (filename.includes('undefined')) {
                console.warn(`Warning: Chunk ${chunk.name} has undefined hash in filename: ${filename}`);
              }
            });
          });
        }
      });
    }

    return config
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Experimental features for better performance
  experimental: {
    scrollRestoration: true,
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,
}

export default withBundleAnalyzer(nextConfig)
