'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGlobe } from 'react-icons/fa';

interface AuthorBioProps {
  author: {
    name: string;
    description: string;
    avatar: {
      url: string;
    };
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
    posts: {
      nodes: Array<{
        title: string;
        slug: string;
        date: string;
      }>;
    };
  };
}

export default function AuthorBio({ author }: AuthorBioProps) {
  if (!author) return null;

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-8 border border-gray-800">
      <div className="flex items-start space-x-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={author.avatar?.url || '/images/default-avatar.png'}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* Author Info */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">
            About {author.name}
          </h3>
          <div 
            className="text-gray-300 mb-4 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: author.description }}
          />

          {/* Social Links */}
          <div className="flex space-x-4">
            {author.social?.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <FaTwitter size={20} />
              </a>
            )}
            {author.social?.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <FaLinkedin size={20} />
              </a>
            )}
            {author.social?.website && (
              <a
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <FaGlobe size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Recent Articles by Author */}
      {author.posts.nodes.length > 1 && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <h4 className="text-lg font-semibold text-white mb-3">
            More from {author.name}
          </h4>
          <div className="grid gap-2">
            {author.posts.nodes
              .slice(0, 3)
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}