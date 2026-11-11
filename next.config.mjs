/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	output: "standalone",
	// output: "export",
	// distDir: "publish",
	experimental: {
		optimizeCss: true,
	},
	images: {
		// unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.hivadnet.ir",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "shahrapi.hivadnet.ir",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "trustseal.enamad.ir",
			},
			{
				protocol: "https",
				hostname: "sep.shaparak.ir",
			},
		],
	},
};

export default nextConfig;
