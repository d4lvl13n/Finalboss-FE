// app/write-for-us/page.tsx

import Header from '../components/Header';
import Footer from '../components/Footer';
import { buildPageMetadata } from '../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Write for FinalBoss.io',
  description: 'Pitch your gaming or technology guest post to the FinalBoss.io editorial team.',
  path: '/write-for-us',
});

export default function WriteForUsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">Write for Us</h1>
          
          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">Submit Your Tech Guest Post to Our Technology Blog</h2>
            <p className="mb-4">Submit a guest post to our technology blog. Want to write for us and share your tech articles? We’re accepting content from businesses, new bloggers, technology companies, digital marketing promoters, and more. Write for us and gain exposure on our tech blog.</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">Why Write a Tech Guest Post for Us?</h2>
            <p className="mb-4">FinalBoss is committed to high-quality and curated content. We’re a trusted name in the tech and entertainment industry, having worked to promote major brands like EA and Ubisoft. Our goal is to provide valuable content that our audience loves. When you submit a guest post to our technology blog, you’re gaining access to a platform that cares about quality.</p>
          </div>
          
          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">Topics for Your Tech Guest Post Submission</h2>
            <p className="mb-4">Want to write for our tech blog? We’re happy to accept content that is relevant to the tech industry and relevant to our audience. What can you submit a tech guest post about?</p>
            <ul className="list-disc list-inside mb-4">
              <li>Tech Trends</li>
              <li>Tech News</li>
              <li>Augmented Reality & Virtual Reality</li>
              <li>Artificial Intelligence</li>
              <li>Gaming Tech</li>
              <li>Machine Learning</li>
              <li>Entertainment Tech</li>
              <li>Cyber Security</li>
              <li>Nanotechnology</li>
              <li>Music Tech</li>
              <li>Cloud Technology</li>
              <li>Business Technology</li>
              <li>Gadgets</li>
              <li>Smartphones</li>
              <li>Internet-Ready Devices</li>
              <li>Computers and PCs</li>
              <li>iOS Technology</li>
              <li>Google Technology</li>
              <li>Blockchain</li>
              <li>Web3</li>
            </ul>
            <p className="mb-4">Got other ideas? When you submit your guest post pitch, tell us more about what you want to write about. We’re happy to listen to your guest post ideas and work with you when you write for us.</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">Submit Your Guest Post: What You Need to Know Before You Write for Us</h2>
            <p className="mb-4">We don’t accept all guest post submissions. We’re only looking for quality content relevant to our niche. Before you submit your guest post, you should know:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Tech guest post submissions should be 600 words or more.</li>
              <li>Tech guest posts should be well-written & proofread before submission.</li>
              <li>You should have your ideas for your tech guest post ready before you pitch to us.</li>
              <li>We do not want to hear from agencies looking to add us to their marketing list.</li>
            </ul>
            <p className="mb-4">When you’re ready to get in touch about submitting your guest post to our tech blog, contact <a href="mailto:thebosses@finalboss.io" className="text-yellow-400">thebosses@finalboss.io</a>. Begin your subject line with ‘GUEST POST’.</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">More About Submitting a Guest Post to FinalBoss</h2>
            <p className="mb-4">FinalBoss.io is a small but growing community that provides up-and-coming content creators and brands with an excellent opportunity to get published and showcase their material to a combined social following of over 6000. We have an average monthly readership of 30,000 unique visitors which comes from natural organic traffic thanks to our healthy website and devotion to best practices. All authors who write for our tech blog will be given proper attribution and relevant backlinks.</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">What Do the Best Tech Blog Guest Posts Include?</h2>
            <p className="mb-4">There is nothing specific that we require from our tech guest post submissions other than the details about writing for us outlined above. However, we can advise that the best tech guest posts will include detailed breakdowns of technology that are explained jargon-free. We want your tech guest post to be understood by all our readers, not just techy people. We also recommend your tech guest posts include sources to all relevant resources and include stats, statistics, or studies where possible to give your tech guest post more authority. If you also think there are some relevant pages on our website already that we can use to provide internal links to your tech guest post, let us know, and we’ll be able to make changes to give the tech piece you write for us more visibility in search engines.</p>
          </div>

          <div className="text-center">
            <a href="mailto:thebosses@finalboss.io" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
              <span>Submit Your Article</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
