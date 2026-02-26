import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import client from '../lib/apolloClient';
import { GET_ALL_AUTHORS } from '../lib/queries/getAuthor';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

const baseUrl = siteConfig.url;

export const metadata: Metadata = {
  title: 'Our Team & Writers',
  description: `Meet the passionate gaming journalists and writers behind ${siteConfig.name}. Our team delivers the latest gaming news, in-depth reviews, and expert guides.`,
  alternates: {
    canonical: `${baseUrl}/authors`,
  },
  openGraph: {
    title: 'Our Team & Writers',
    description: `Meet the passionate gaming journalists and writers behind ${siteConfig.name}.`,
    url: `${baseUrl}/authors`,
    type: 'website',
  },
};

interface AuthorNode {
  id: string;
  slug: string;
  name: string;
  description?: string;
  avatar?: {
    url: string;
  };
  posts?: {
    pageInfo: {
      total?: number;
    };
  };
}

async function getAuthors(): Promise<AuthorNode[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_AUTHORS,
      fetchPolicy: 'no-cache',
    });
    console.log('Authors fetched:', data?.users?.nodes?.length || 0);
    return data?.users?.nodes || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}${siteConfig.logoPath}`,
    description: siteConfig.description,
    foundingDate: '2020',
    sameAs: [
      siteConfig.socialLinks.twitter,
      siteConfig.socialLinks.youtube,
    ],
    employee: authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: `${baseUrl}/author/${author.slug}`,
      image: author.avatar?.url,
      jobTitle: 'Gaming Writer',
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Authors', item: `${baseUrl}/authors` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section - Our Story */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              {t('pages.authors.heroHeading', { name: siteConfig.name })}
            </h1>
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                <span className="text-yellow-400 font-semibold">{siteConfig.name}</span>{t('pages.authors.heroParagraph1')}
              </p>

              <p>
                {t('pages.authors.heroParagraph2')}
              </p>

              <p>
                {t('pages.authors.heroParagraph3Part1')}<span className="text-white font-medium">{t('pages.authors.heroParagraph3Part2')}</span>{t('pages.authors.heroParagraph3Part3')}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.authors.valuesHeading')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">{t('pages.authors.value1Title')}</h3>
                <p className="text-gray-400">
                  {t('pages.authors.value1Description')}
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">{t('pages.authors.value2Title')}</h3>
                <p className="text-gray-400">
                  {t('pages.authors.value2Description')}
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">{t('pages.authors.value3Title')}</h3>
                <p className="text-gray-400">
                  {t('pages.authors.value3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('pages.authors.teamHeading')}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {t('pages.authors.teamDescription')}
              </p>
            </div>

            {authors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {authors.map((author) => (
                  <Link
                    key={author.id}
                    href={`/author/${author.slug}`}
                    className="group block bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover:bg-gray-800"
                  >
                    {/* Avatar */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {author.avatar?.url ? (
                        <Image
                          src={author.avatar.url}
                          alt={author.name}
                          fill
                          sizes="96px"
                          className="rounded-full object-cover border-3 border-gray-700 group-hover:border-yellow-400/50 transition-colors"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-gray-900">
                          {author.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-semibold text-center mb-2 group-hover:text-yellow-400 transition-colors">
                      {author.name}
                    </h3>

                    {/* Role */}
                    <p className="text-sm text-yellow-400/80 text-center mb-3">
                      {t('pages.authors.writerRole')}
                    </p>

                    {/* Bio */}
                    {author.description && (
                      <p className="text-sm text-gray-400 text-center line-clamp-2 mb-4">
                        {author.description}
                      </p>
                    )}

                    {/* Article Count */}
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        {t('pages.authors.viewArticles')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">{t('pages.authors.noAuthors')}</p>
            )}
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-yellow-400/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t('pages.authors.ctaHeading')}</h2>
            <p className="text-gray-400 mb-8">
              {t('pages.authors.ctaDescription')}
            </p>
            <Link
              href="/write-for-us"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors"
            >
              {t('pages.authors.ctaButton')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

