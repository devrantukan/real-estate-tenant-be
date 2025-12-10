/**
 * Next.js Configuration
 * @type {import('next').NextConfig}
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig = {
  /**
   * Turbopack configuration
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
   */
  turbopack: {
    /**
     * Module resolution aliases
     * Maps module imports to different modules or paths.
     * Supports conditional aliasing with the `browser` condition.
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/turbopack#resolvealias
     * @example
     * resolveAlias: {
     *   underscore: 'lodash',
     *   mocha: { browser: 'mocha/browser-entry.js' },
     * }
     */
    resolveAlias: {
      /**
       * Prevent fs module from being bundled in client-side code.
       * When targeting browser environments, fs imports resolve to an empty module.
       */
      fs: {
        browser: './empty.ts',
      },
    },
  },
  // React 19 compatibility
  reactStrictMode: true,
};

export default nextConfig;
