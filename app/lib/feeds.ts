type FeedItem = {
  title: string;
  url: string;
  description: string;
  published: string;
};

export function buildRssFeed({
  title,
  description,
  siteUrl,
  items,
}: {
  title: string;
  description: string;
  siteUrl: string;
  items: FeedItem[];
}): string {
  const lastBuildDate = items[0]?.published
    ? new Date(items[0].published).toUTCString()
    : new Date().toUTCString();

  const channelItems = items
    .map(
      (item) => `<item>
        <title><![CDATA[${item.title}]]></title>
        <link>${item.url}</link>
        <guid>${item.url}</guid>
        <pubDate>${new Date(item.published).toUTCString()}</pubDate>
        <description><![CDATA[${item.description}]]></description>
      </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[${title}]]></title>
      <link>${siteUrl}</link>
      <description><![CDATA[${description}]]></description>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      ${channelItems}
    </channel>
  </rss>`;
}

