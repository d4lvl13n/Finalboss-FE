import { notFound } from 'next/navigation';
import client from '../../lib/apolloClient';
import { GET_POST_BY_SLUG } from '../../lib/queries/getPostBySlug';
import Image from 'next/image';

export default async function GamingArticlePage({ params }: { params: { slug: string } }) {
  // Fetch the post data based on the slug
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug: params.slug },
  });

  const article = data?.post;

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent">{article.author.node.name}</p>
            <p className="text-sm text-gray-400">{new Date(article.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="relative w-full h-96 mb-8">
          {article.featuredImage && (
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          )}
        </div>
        <div className="leading-relaxed text-lg">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </div>
  );
}
