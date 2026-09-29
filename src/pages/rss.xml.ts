export const prerender = false;

import { getRssString } from '@astrojs/rss';

import { APP_BLOG } from 'astrowind:config';
import { getBlogPosts } from '~/lib/content';
import { site, siteOrigin } from '~/config/site';

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await getBlogPosts();
  const origin = siteOrigin();

  const rss = await getRssString({
    title: `${site.name}'s Blog`,
    description: site.description,
    site: origin,

    items: posts.map((post) => ({
      link: `${origin}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(post.publishDate),
    })),

    trailingSlash: site.trailingSlash,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
