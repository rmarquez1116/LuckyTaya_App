/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // If using the next.js app behind a proxy, make sure the headers are properly passed
    headers: async () => {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Forwarded-Proto',
                        value: 'https', // if you're using HTTPS
                    }
                ],
            },
        ];
    },
};

export default nextConfig;
