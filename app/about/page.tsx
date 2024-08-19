// app/about/page.tsx

import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    image: '/images/john.jpg',
    bio: 'John is the visionary behind FinalBoss.io...'
  },
  {
    name: 'Jane Smith',
    role: 'Lead Editor',
    image: '/images/jane.jpg',
    bio: 'Jane ensures that all the content meets the highest standards...'
  }
  // Add more team members here
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">About Us</h1>
          
          <div className="text-lg leading-relaxed mb-16">
            <p className="mb-4">FinalBoss.io is your go-to source for gaming news, reviews, and guides. Founded in 2024, we are passionate about providing the most accurate and engaging content for the gaming community.</p>
            <p>Our mission is to empower gamers with the knowledge they need to make informed decisions, whether it's about the latest game releases, tech advancements, or industry trends.</p>
          </div>
          
          <h2 className="text-4xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-lg text-center shadow-lg">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={member.image} layout="fill" objectFit="cover" alt={member.name} />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-yellow-400 mb-4">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
