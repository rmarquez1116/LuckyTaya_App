/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // headers: async () => {
    //     return [
    //         {
    //             source: '/:path*',
    //             headers: [
    //                 {
    //                     key: 'X-Forwarded-Proto',
    //                     value: 'https', // if you're using HTTPS
    //                 }
    //             ],
    //         },
    //     ];
    // },
};

export default nextConfig;
