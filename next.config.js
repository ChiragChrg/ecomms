/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
})

const nextConfig = withPWA({
    images: {
        domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"]
    },
})


module.exports = nextConfig
