// components/TechnologySection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const technologyArticles = [
  {
    id: 1,
    title: "The Future of AI in Gaming",
    image: "/images/ai-gaming.jpg",
    excerpt: "How AI is shaping the future of game development.",
    slug: "future-of-ai-in-gaming"
  },
  {
    id: 2,
    title: "VR Advancements in 2024",
    image: "/images/vr-2024.jpg",
    excerpt: "Exploring the latest VR technologies and their impact on gaming.",
    slug: "vr-advancements-2024"
  },
  {
    id: 3,
    title: "Blockchain in Gaming",
    image: "/images/blockchain-gaming.jpg",
    excerpt: "How blockchain is revolutionizing in-game economies.",
    slug: "blockchain-in-gaming"
  },
  {
    id: 4,
    title: "Cybersecurity for Gamers",
    image: "/images/cybersecurity-gaming.jpg",
    excerpt: "Protecting your data in the gaming world.",
    slug: "cybersecurity-for-gamers"
  },
  {
    id: 5,
    title: "5G and Gaming: The Future",
    image: "/images/5g-gaming.jpg",
    excerpt: "How 5G is transforming the gaming experience.",
    slug: "5g-and-gaming"
  },
  {
    id: 6,
    title: "AI and Game Development",
    image: "/images/ai-game-development.jpg",
    excerpt: "The impact of AI on game development and design.",
    slug: "ai-and-game-development"
  },
  {
    id: 7,
    title: "Smart Devices for Gaming",
    image: "/images/smart-devices-gaming.jpg",
    excerpt: "Enhancing gaming experiences with smart devices.",
    slug: "smart-devices-for-gaming"
  },
  {
    id: 8,
    title: "Cloud Gaming Services",
    image: "/images/cloud-gaming.jpg",
    excerpt: "How cloud gaming is changing the industry.",
    slug: "cloud-gaming-services"
  },
  {
    id: 9,
    title: "Nanotechnology in Gaming",
    image: "/images/nanotechnology-gaming.jpg",
    excerpt: "The role of nanotechnology in future gaming devices.",
    slug: "nanotechnology-in-gaming"
  },
  {
    id: 10,
    title: "Augmented Reality in Gaming",
    image: "/images/ar-gaming.jpg",
    excerpt: "How AR is blending the real and virtual worlds in gaming.",
    slug: "augmented-reality-in-gaming"
  }
];

const TechnologySection = () => {
  return (
    <section className="py-16 bg-gray-900">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Technology</h2>
      <div className="container mx-auto px-4">
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom' // Targeting the custom pagination container
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {technologyArticles.map((article) => (
            <SwiperSlide key={article.id}>
              <Link 
                href={`/technology/${article.slug}`}
                className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image src={article.image} layout="fill" objectFit="cover" alt={article.title} />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400">{article.excerpt}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-custom mt-4"></div> {/* Custom pagination container below the slider */}
        <div className="text-center mt-12">
          <Link href="/technology" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
            <span>View More Technology</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
