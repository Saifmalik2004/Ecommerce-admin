/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/dnuo5t1d3/image/upload/**',
            },
        ],
    },
};

export default nextConfig;
