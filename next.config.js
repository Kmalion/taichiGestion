/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
  }
   
  module.exports = {
    images: {
      domains: ['nyc3.digitaloceanspaces.com', 'diagnosticomedico.pe', 'taichi-holdings-colombia.com'],
    },
    compiler: {
      styledComponents: true,
    },
  }