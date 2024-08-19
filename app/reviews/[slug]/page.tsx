import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReviewContent from '../../components/ReviewContent'; // A specialized component for reviews

interface Review {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  category: string;
  platform: string;
  releaseDate: string;
  developer: string;
}

const reviews: Review[] = [
  {
    slug: 'ff16-review',
    title: 'Final Fantasy 16 Review: Like A Phoenix From The Ashes',
    author: 'John Smith',
    date: 'July 10, 2024',
    content: `Final Fantasy 16 is a promising continuation of the beloved series. It’s a different type of Final Fantasy that we’re used to, which breaks the strict RPG customs of all previous entries, focusing more on combat, yet still nailing a compelling and clearly darker narrative.

It’s hands down the best PS5 exclusive out now, and the first one that will make you feel left out if you don’t own the console. 

The bottom line is that Final Fantasy 16 is a darn good game, worth its weight in gold, and for RPG fanatics, it won’t get any better, so I highly recommend playing the game. However, it does have its shortcomings which I’ll sprinkle throughout this review.
Clive Rosfield is a Prince of Rosaria who’s haunted by a past etched in flames. We embody Clive throughout the game, first in his teens, then twenties, and finally, his thirties. The premise of the story is that Clive is the Dominant of the Fire Eikon Ifrit, and first, he makes amends with his nature and then helms the struggle for freedom of the Branded, fighting other nations and Dominants in the process.

The story keeps evolving over the course of the game, becoming much darker. The NPCs and the voice acting is on-point, and they are just as well-crafted as Clive. 

You’ll genuinely love the story of this Final Fantasy 16. It’s gritty, never loses its tempo, and is backed by a supporting cast that delivers a convincing performance.

However, one thing which greatly breaks the immersion is that there is a huge time skip in the latter part of the game, and when we see the characters again, they’re wearing the exact same clothes.

Have you ever gone years without changing your shirt?

The plot expands little by little, and the new Active Time Lore feature helps you refresh your memory and understand everything happening on-screen at any point, so kudos to Creative Business Unit III for this remarkable new addition.

Nods to previous Final Fantasy games are also there just so you know.

The highlight of the main story remains its gameplay, the giant boss battles between Eikons, and the built-up to those moments. Clive transforming into Ifrit and fighting the mountain-sized Titan Lost is the biggest brawl I’ve seen since Kratos versus Cronos in God of War, and far more enjoyable. 

If it isn’t clear already, Final Fantasy 16 has a colossal scale that keeps getting bigger and bigger.

final fantasy 16 release date
Unlike Final Fantasy 15, FF16 is semi-open world, but still packs decently-sized areas. Side-quests generally suck, following the same genre tropes of go here, do this, do that. 

At its core, Final Fantasy 16 is a glorified amalgam of the best action-RPG games of the past decade. It’s a stunning work of art which thanks to its enthralling narrative, phenomenal orchestra, stupefying boss fights, and amazeballs combat, shines amongst its lineage as a worthy, yet different addition.

Final Fantasy 16 is an Eikonic adventure, and while it has severely lackluster RPG elements, it’s still the best mainline Final Fantasy game we’ve had in a long, long time.
`, // Article content here`, 
    image: '/images/ff16-review.jpg',
    category: 'reviews',
    platform: 'PlayStation 5',
    releaseDate: 'June 22, 2024',
    developer: 'Square Enix',
  },
  // Add more reviews here
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const review = reviews.find((r) => r.slug === params.slug);

  if (!review) {
    return {
      title: 'Review Not Found',
      description: 'This review could not be found.',
    };
  }

  return {
    title: review.title,
    description: review.content.slice(0, 150),
    openGraph: {
      title: review.title,
      description: review.content.slice(0, 150),
      images: [
        {
          url: review.image,
          width: 800,
          height: 600,
          alt: review.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: review.title,
      description: review.content.slice(0, 150),
      images: [review.image],
    },
  };
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const review = reviews.find((r) => r.slug === params.slug);

  if (!review) {
    notFound();
  }

  return (
    <div>
      {/* Pass the review data to the client component */}
      <ReviewContent
        title={review.title}
        author={review.author}
        date={review.date}
        content={review.content}
        image={review.image}
        platform={review.platform}
        releaseDate={review.releaseDate}
        developer={review.developer}
      />
    </div>
  );
}
