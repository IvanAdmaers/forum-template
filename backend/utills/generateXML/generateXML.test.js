/* eslint-disable no-undef */
const generateXML = require('./generateXML');

describe('generateXML', () => {
  it('should return a correct sitemap', () => {
    const expected =
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>/slug</loc><lastmod>today</lastmod><priority>1.0</priority></url><url><loc>/slug2</loc><lastmod>yesterdat</lastmod><priority>0.8</priority></url></urlset>';
    const data = [
      {
        urlset: [
          {
            _attr: {
              xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            },
          },
          {
            url: [{ loc: '/slug' }, { lastmod: 'today' }, { priority: '1.0' }],
          },
          {
            url: [
              { loc: '/slug2' },
              { lastmod: 'yesterdat' },
              { priority: '0.8' },
            ],
          },
        ],
      },
    ];

    const sitemapXML = generateXML(data);

    expect(sitemapXML).toBe(expected);
  });
});
