import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import client from '../../lib/apolloClient';
import { GET_AUTHOR_BY_SLUG, GET_ALL_AUTHORS, Author } from '../../lib/queries/getAuthor';
import AuthorArticlesGrid from '../../components/Author/AuthorArticlesGrid';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all authors
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: GET_ALL_AUTHORS,
    });
    
    return data?.users?.nodes?.map((author: { slug: string }) => ({
      slug: author.slug,
    })) || [];
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { data } = await client.query({
      query: GET_AUTHOR_BY_SLUG,
      variables: { slug },
    });

    const author: Author = data?.user;
    
    if (!author) {
      return {
        title: 'Author Not Found | FinalBoss.io',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
    const description = author.description || `Read articles by ${author.name} on FinalBoss.io - Gaming news, reviews, guides and more.`;

    return {
      title: `${author.name} - Author | FinalBoss.io`,
      description,
      alternates: {
        canonical: `${baseUrl}/author/${author.slug}`,
      },
      openGraph: {
        title: `${author.name} - Author | FinalBoss.io`,
        description,
        url: `${baseUrl}/author/${author.slug}`,
        type: 'profile',
        images: author.avatar?.url ? [{ url: author.avatar.url }] : undefined,
      },
      twitter: {
        card: 'summary',
        title: `${author.name} - Author | FinalBoss.io`,
        description,
      },
    };
  } catch {
    return {
      title: 'Author | FinalBoss.io',
    };
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  
  let author: Author | null = null;
  
  try {
    const { data } = await client.query({
      query: GET_AUTHOR_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });
    author = data?.user;
  } catch (error) {
    console.error('Error fetching author:', error);
  }

  if (!author) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

  // Person Schema (JSON-LD)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
    description: author.description || `Gaming writer at FinalBoss.io`,
    image: author.avatar?.url,
    sameAs: [],
    jobTitle: 'Gaming Writer',
    worksFor: {
      '@type': 'Organization',
      name: 'FinalBoss.io',
      url: baseUrl,
    },
  };

  // ProfilePage Schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: personSchema,
    name: `${author.name} - Author Profile`,
    description: author.description || `Read articles by ${author.name} on FinalBoss.io`,
    url: `${baseUrl}/author/${author.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Avatar */}
            <div className="mb-6">
              {author.avatar?.url ? (
                <Image
                  src={author.avatar.url}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto border-4 border-yellow-400/30 shadow-xl"
                />
              ) : (
                <div className="w-30 h-30 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl font-bold text-gray-900 shadow-xl">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {author.name}
            </h1>

            {/* Bio */}
            {author.description && (
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                {author.description}
              </p>
            )}
          </div>
        </section>

        {/* Articles Section with Pagination */}
        <AuthorArticlesGrid 
          authorId={author.databaseId} 
          authorName={author.name} 
        />
      </main>

      <Footer />
    </>
  );
}
