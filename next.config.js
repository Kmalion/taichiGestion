/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
  }
   
  module.exports = {
    images: {
      domains: ['nyc3.digitaloceanspaces.com', 'taichi-holdings-colombia.com'],
    },
    compiler: {
      styledComponents: true,
    },
  }