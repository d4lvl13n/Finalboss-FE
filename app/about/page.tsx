// app/about/page.tsx

import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

export const metadata = buildPageMetadata({
  title: 'About Us',
  description: `Learn about the ${siteConfig.name} team delivering gaming news, reviews, and guides.`,
  path: '/about',
});

const isFinalboss = siteConfig.url.includes('finalboss.io');

const teamMembers = [
  {
    name: 'Adam White',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/23052d3b98f5d93ccdcf5fc2774dfb2d4a911411faf2028a357c32aec0a109f6?s=256&d=retro&r=g',
    bio: "Aspiring writer Adam, whose screenplay will 100%, definitely, for sure, go into production any day now, brings you cutting edge reviews and content relating to all things TV, movies and video games."
  },
  {
    name: 'Aleksa',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/6b39a2ab66eb556477ef29b3787f54e288cbd5a7d435346a9f4fbdf3727b6691?s=256&d=retro&r=g',
    bio: 'Meet Aleksa, a seasoned tech writer and avid gamer at heart. Devoting countless hours to honing his skills, Aleksa evolved into a professional gamer, traversing the globe and participating in premier gaming tournaments.'
  },
  {
    name: 'Callum Royal',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/21dcef9c1080c4de5f759dcf9c41b09fa961325c50812435669f1ddfe95255e2?s=256&d=retro&r=g',
    bio: 'Avid fan of many geeky exploits, Callum likes to delve deep into the lore of fantasy and sci-fi, including The Lord of the Rings, Harry Potter, Game of Thrones, The Hunger Games and many more.'
  },
  {
    name: 'Charly Venables',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/3d75aaf574d17c6d92128a42c91762fa0766f39fbb3683dfe5322ad267525cfd?s=256&d=retro&r=g',
    bio: "Charly is your friendly neighbourhood gaming nerd with a thing for strategy RPGs, visual novels and all things anime. When she's not plugging 80+ hours into anything by Atlus, Chunsoft or NIS, she's arguing with James and Ryan about Netflix series. Or cake."
  },
  {
    name: 'Ethan Smith',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/662d353e94feb93bc0498bd6059443d4eddc7e0add3dc9ca484b511b0b9bd4e1?s=256&d=retro&r=g',
    bio: 'A dedicated contributor to the FinalBoss team, Ethan covers the latest in gaming news, reviews and industry insights.'
  },
  {
    name: 'FinalBoss',
    role: 'Editorial Team',
    image: 'https://secure.gravatar.com/avatar/755e823511a20ad144fc2740ba28877a96ff086f595f5cc2e3c48ce4968a1612?s=256&d=retro&r=g',
    bio: 'With a joystick in one hand and a movie ticket in the other, FinalBoss is the geeky buddy you want by your side. Diving into the latest games, exploring cutting-edge tech, and riding the cinematic rollercoaster.'
  },
  {
    name: 'GAIA',
    role: 'AI Editor',
    image: 'https://secure.gravatar.com/avatar/6f8e320caebb808083217a97e50b0ec55ae9dafebfe2223b0c086812f0562ddd?s=256&d=retro&r=g',
    bio: 'GAIA is the AI-powered editorial engine behind FinalBoss, helping curate and deliver gaming news around the clock.'
  },
  {
    name: 'Haissam',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/b287059c46fc0b86b400461ac226ccfcaa14d4f0f3e0a15ac035efdec19a3b66?s=256&d=retro&r=g',
    bio: 'Haissam knows his way around a laundry list of expansive open worlds. He has conquered Hyrule, mastered the art of the warrior in Sekiro, and he even delves into the occasional retro RTS RPG now and again.'
  },
  {
    name: 'James Speyer',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/8f167965aaed1cc68bf4081e54e02deffe6d442a43f3f0eba8a01330886fa3cd?s=256&d=retro&r=g',
    bio: "James is THG's technophobic TV nut, movie addict and theorist crackpot. He'll be bringing you features, insights and incoherent ramblings on all your favourite and least favourite shows and movies."
  },
  {
    name: 'Joseph Rowe',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/4086ac0e1490a8097c64048344807a344c3a6a7ba849a2aa4a2c7587af9cbd60?s=256&d=retro&r=g',
    bio: "Joseph has been writing about games for over a decade. His gaming interests are wide and varied, but he's most fond of fighting games, the Civilization series, Pokemon, and most Blizzard games. When he's not gaming, he's watching trashy reality TV, listening to comedy podcasts, studying languages, building websites, or starting SEO side projects."
  },
  {
    name: 'Jon Holmes',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/22d5dc250c1714df1fc7340a1fab857e93e8468257bc932892fcb1f5a31f8c53?s=256&d=retro&r=g',
    bio: 'Jon Holmes is a writer based in the UK. Alongside his work writing for film, he is a multi-accoladed filmmaker in his own right, and also performs.'
  },
  {
    name: 'Lan Di',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/02222cce294ebc186fe8b180e92053b62884cda0ace23c04193c522636d32786?s=256&d=retro&r=g',
    bio: 'Lan Di is a known figure among the four leading rank members of the Chi You Men. With his cold, calculating demeanor and piercing gaze, he strikes fear into the hearts of those who cross his path.'
  },
  {
    name: 'Peter Elsmere',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/e153239990b49e768dd10d594b98474ee0c43e1ec27a517a67f8dbd71d721849?s=256&d=retro&r=g',
    bio: 'Peter is a cinephile currently studying filmmaking, with a particular interest in the use of sound. Alongside his love of movies, Peter is passionate about video games and technology.'
  },
  {
    name: 'Ryan Lipton',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/bdd273ad2b65535f895120cbb740f56da541f82ee82702fe7eb12849ace01f17?s=256&d=retro&r=g',
    bio: "Ryan is your local game aficionado. A master button basher with years of dedicated gaming under his belt, he'll constantly be keeping you up to date with all the latest releases."
  },
  {
    name: 'Sara C',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/ca7a44346490a25c97eb1725e2ce88d53f0492e7fcbdde796601c3396f23563d?s=256&d=retro&r=g',
    bio: "Sara's love for the wizarding world is so intense that she's probably mastered the art of Accio-ing pizza right into her mouth. When she's not busy casting spells, you can find her jumping through obstacles in her favourite platformers."
  },
  {
    name: 'Scott Jones',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/841b1be51ef155b44b36b5c5a82d5d4b469c3cea25c1e1ffe0d5cbb9d6749615?s=256&d=retro&r=g',
    bio: "FinalBoss' master of Memes, Scott Anthony, might be an Assassin's Creed fanboy, but that doesn't mean he can dodge like Ezio. Regularly found flattened by some unseen sniper shot."
  },
  {
    name: 'Shaun Dearling',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/b6d4a5cb3f513d076afd7425a78f1b879670a53f9452e99b15fe18a135d5473b?s=256&d=retro&r=g',
    bio: "Shaun is FinalBoss' most prolific cinephile. If he hasn't seen it, it ain't worth watching. You'll find him writing about everything from blowout blockbusters to small-screen splendours."
  },
  {
    name: 'Srivats',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/44909f22cf2042add83a680a1b1055706c1f53d11a4c169e665e41b84826941d?s=256&d=retro&r=g',
    bio: 'With 3 years experience in journalism prior to joining the FinalBoss team, Srivats has made a name for himself as the go-to guy for in-depth analysis and technical pieces.'
  },
  {
    name: 'Tayyab',
    role: 'Writer',
    image: 'https://secure.gravatar.com/avatar/11654e82c1d3c875fa60b4c2f97666c51daaa708354b0afc11dcbae04caab440?s=256&d=retro&r=g',
    bio: "Tayyab is an anime & gaming enthusiast, and since he can't make them (yet), he loves to write about why he finds them amazing. Also a huge Hideo Kojima fan, and everything else that's Japanese."
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">{t('pages.about.heading')}</h1>
          
          <div className="text-lg leading-relaxed mb-16">
            <p className="mb-4">{siteConfig.name}{t('pages.about.intro1')}</p>
            <p>{t('pages.about.intro2')}</p>
          </div>
          
          {isFinalboss && (
            <>
              <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.about.teamHeading')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-gray-800 p-8 rounded-lg text-center shadow-lg">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image src={member.image} fill sizes="128px" className="object-cover" alt={member.name} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-yellow-400 mb-4">{member.role}</p>
                    <p className="text-gray-400">{member.bio}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
