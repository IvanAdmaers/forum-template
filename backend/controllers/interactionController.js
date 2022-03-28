const PostService = require('../services/PostService');

const { generateXML } = require('../utills');

exports.getContacts = async (req, res) =>
  res.json({
    contacts: 'Contact with us by email: test@test.test',
  });

exports.getSitemap = async (req, res) => {
  const totalCount = await PostService.totalCount();
  const allPosts = await PostService.getPosts(totalCount, 0);

  const clientURL = process.env.CLIENT_URL;

  const postsData = allPosts.map(({ slug, createdAt }) => ({
    url: [
      { loc: `${clientURL}/post/${slug}` },
      { lastmod: createdAt.toISOString() },
      { priority: '0.8' },
    ],
  }));

  const data = [
    {
      urlset: [
        {
          _attr: {
            xmlns: 'https://www.sitemaps.org/schemas/sitemap/0.9',
          },
        },
        ...postsData,
      ],
    },
  ];

  const sitemapXML = generateXML(data);

  res.set('Content-Type', 'text/xml');
  return res.send(sitemapXML);
};
