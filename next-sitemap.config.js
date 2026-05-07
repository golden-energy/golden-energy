/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.goldenenerggy.com/',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.8,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}