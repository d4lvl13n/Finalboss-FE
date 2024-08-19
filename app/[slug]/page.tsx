import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ArticleContent from '../components/ArticleContent';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
}

// Mock article data (replace with real data fetching in a real app)
const articles: Article[] = [
  {
    slug: 'manor-lords-mac',
    title: 'How to Play Manor Lords on Mac',
    author: 'Jane Doe',
    date: 'August 18, 2024',
    content: `
      Despite being available exclusively on PC via Steam, Mac users need not feel left out. 
      You can still enjoy the medieval strategy game, Manor Lords on your Mac, thanks to cloud gaming platforms like GeForce Now. 
      Here’s a simple guide on how to get started.

      **Requirements:**
      To play Manor Lords on your Mac, you’ll need:
      
      - A GeForce Now Subscription: This cloud gaming service by NVIDIA allows you to stream games from powerful servers directly to your device.
      - Purchase the Game on Steam: You need to own the game on Steam to play it via GeForce Now.
      - Alternatively, Xbox Game Pass Ultimate: If you have an Xbox Game Pass Ultimate subscription (Check our Partner for a discounted subscription), you can also enjoy Manor Lords as part of their cloud gaming lineup.

      **Step-by-Step Guide to Play Manor Lords on Mac:**

      1. **Sign Up for GeForce Now:**
         Visit the GeForce Now website and choose a subscription plan. NVIDIA offers both free and premium tiers, but for a smoother gaming experience with extended session lengths, the premium subscription is recommended.

      2. **Install GeForce Now:**
         Download and install the GeForce Now application on your Mac. Follow the on-screen instructions to complete the setup.

      3. **Link Your Steam Account:**
         Open the GeForce Now app and link your Steam account to it. This step is crucial as it allows GeForce Now to access your game library.

      4. **Purchase Manor Lords on Steam:**
         If you haven’t already, purchase Manor Lords on Steam. Ensure that your Steam account is linked to GeForce Now to access the game.

      5. **Launch the Game:**
         Search for Manor Lords within the GeForce Now app. Once you find it, click on ‘Play’ to start streaming the game on your Mac.

      6. **Alternatively, Use Xbox Game Pass Ultimate:**
         If you are an Xbox Game Pass Ultimate subscriber, you can access Manor Lords through Microsoft’s cloud gaming service. Just ensure you have the Xbox app or visit the Xbox website, log in with your credentials, and stream the game on your Mac.

      **Tips for the Best Experience:**

      - **Stable Internet Connection:** Ensure you have a stable and fast internet connection for an uninterrupted gaming experience. GeForce Now recommends at least a 15 Mbps connection for 720p streaming and 25 Mbps for 1080p.
      - **Wired Connection:** For the best performance, consider using a wired Ethernet connection instead of Wi-Fi.
      - **Update Your Mac:** Keep your macOS up to date to ensure compatibility and optimal performance with the GeForce Now app.

      By following these steps, you can enjoy Manor Lords on your Mac and dive into its complex strategy and medieval town-building gameplay without needing a gaming PC. Happy gaming!

      Here is our Beginner Guide to Start in Manor Lords.
    `,
    image: '/images/gaming-mac.jpg',
  },
  // You can add more mock articles here if needed
];

// Generate metadata for SEO purposes
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'This article could not be found.',
    };
  }

  return {
    title: article.title,
    description: article.content.slice(0, 150), // A brief summary for the meta description
    openGraph: {
      title: article.title,
      description: article.content.slice(0, 150),
      images: [
        {
          url: article.image,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.content.slice(0, 150),
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound(); // This will trigger Next.js's default 404 page
  }

  return (
    <div>
      <ArticleContent
        title={article.title}
        author={article.author}
        date={article.date}
        content={article.content}
        image={article.image}
      />
    </div>
  );
}
