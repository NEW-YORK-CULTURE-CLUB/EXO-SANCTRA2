'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, User, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

// Article data - in a real app, this would come from a CMS or API
const articles = {
  'exhibitiq-launches-revolutionary-operating-system': {
    title: "ExhibitIQ Launches Revolutionary Operating System",
    excerpt: "We're excited to announce the launch of our Operating System, a breakthrough technology that securely stores and syncs artwork data for seamless display across both physical and digital platforms.",
    content: `
      <p>We're excited to announce the launch of our Operating System, a breakthrough technology that securely stores and syncs artwork data for seamless display across both physical and digital platforms. This innovation represents a significant step forward in bridging the gap between traditional art presentation and modern digital experiences.</p>
      
      <p>For too long, the art world has struggled with fragmented systems that don't communicate with each other. Galleries use one platform for inventory management, another for client relationships, and yet another for digital displays. This creates inefficiencies, data silos, and missed opportunities for engagement.</p>
      
      <p>Our Operating System changes all of that by providing a unified platform that seamlessly integrates every aspect of art management and presentation. Whether you're displaying a piece in a physical gallery or on a digital screen, the system ensures that all data remains synchronized and up-to-date.</p>
      
      <h2>Key Features</h2>
      
      <p><strong>Unified Data Management:</strong> All artwork information, from provenance to pricing, is stored in one secure, cloud-based system that's accessible from anywhere.</p>
      
      <p><strong>Real-time Synchronization:</strong> Changes made in one location are instantly reflected across all platforms, ensuring consistency and accuracy.</p>
      
      <p><strong>Cross-Platform Display:</strong> The same artwork can be displayed on physical screens, digital galleries, mobile apps, and web platforms with perfect consistency.</p>
      
      <p><strong>Advanced Security:</strong> Built-in encryption and access controls ensure that sensitive information remains protected while still being easily accessible to authorized users.</p>
      
      <p><strong>Scalable Architecture:</strong> The system grows with your business, from small galleries to large museum networks.</p>
      
      <h2>Impact on the Art World</h2>
      
      <p>This Operating System represents more than just a technological advancement—it's a fundamental shift in how we think about art presentation and management. By breaking down the barriers between physical and digital spaces, we're creating new possibilities for engagement and accessibility.</p>
      
      <p>Galleries can now offer immersive digital experiences that complement their physical spaces. Collectors can access detailed information about their pieces from anywhere in the world. Artists can track their work's journey and maintain better relationships with galleries and collectors.</p>
      
      <p>Most importantly, this system ensures that art remains at the center of the experience, with technology serving as an invisible bridge that connects people to the works they love.</p>
      
      <h2>Looking Forward</h2>
      
      <p>This is just the beginning. As we continue to develop and refine our Operating System, we're exploring new ways to enhance the art experience through technology. From AI-powered curation to virtual reality exhibitions, the possibilities are endless.</p>
      
      <p>We invite galleries, museums, artists, and collectors to join us in this journey toward a more connected, accessible, and engaging art world.</p>
      
      <div class="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
        <p class="text-sm text-foreground">
          <strong>Ready to experience the future of art management?</strong><br/>
          Contact our team to learn more about how ExhibitIQ's Operating System can transform your art business.
        </p>
      </div>
    `,
    image: "https://images.unsplash.com/photo-1729786423717-07716ec501e9?",
    category: "Platform Updates",
    date: "August 15, 2025",
    author: "ExhibitIQ Team",
    readTime: "5 min read",
    tags: ["Operating System", "Platform Updates", "Technology", "Innovation"]
  },
  'hidden-crisis-gallery-closures': {
    title: "The Hidden Crisis Behind Gallery Closures",
    excerpt: "Arusha Gallery's legal battle over unpaid fees is not an exception but a symptom of an art world still running on trust without infrastructure.",
    content: `
      <p>When a gallery closes or collapses financially, the art does not vanish. It still exists. But too often, the systems around it fall apart.</p>
      
      <p>In the past, that was less of a problem. The art world ran on trust. Handshakes, long relationships, and mutual understanding were enough to assure a clean break. Artists reclaimed their work, collectors kept their records, and the cycle moved forward.</p>
      
      <p>But the market changed. Costs rose. Competition intensified. The pace of sales accelerated. What never changed was the infrastructure to support this growth. Documentation stayed scattered, contracts inconsistent, and records incomplete. And when a gallery fails under those conditions, the cracks do not just show, they ripple outward.</p>
      
      <p>The result is visible across the industry. Artists stripped of payment. Collectors caught in limbo. Galleries once celebrated for championing artists are suddenly cast as villains, not because they lacked care, but because they lacked systems strong enough to withstand collapse.</p>
      
      <p>The ongoing dispute at Arusha Gallery in 2025 is a case in point. Artists claim more than half a million pounds in unpaid fees. One artist, Charlotte Keates, says she is owed £430,000 despite generating around £1 million in sales since 2023. Others report months, sometimes years, waiting for payment, unsure whether works were ever delivered to collectors [1].</p>
      
      <p>What should have been routine transactions instead collapsed into uncertainty. The artworks still exist. But clarity around ownership, delivery, and payment has all but vanished.</p>
      
      <p>This is not an isolated failure. Across the art world, when galleries collapse, artists lose access to their own work. Unpaid storage bills can lock pieces behind warehouse doors. Creditors can claim art as collateral. In some cases, works are sold off to cover debts, leaving artists uncompensated and collectors trapped in disputes [2].</p>
      
      <p>These are not accidents. They are symptoms of an industry still running on handshake trust, rather than transparent and verifiable systems.</p>
      
      <p>The problem is not that galleries close. Closures are part of the cycle. The problem is that the art world has never built the infrastructure to ensure art, records, and relationships survive when they do.</p>
      
      <p>When a gallery fails, the art should never vanish into uncertainty. It should remain exactly where it belongs, with the artists who created it and the people who value it.</p>
      
      <p>The real question is not "where does the art go?"</p>
      
      <p>It is "why have we allowed it to keep getting lost?"</p>
      
      <p>And what will it take to make sure it never happens again?</p>
      
      <div class="mt-8 p-4 bg-muted rounded-lg">
        <p class="text-sm text-muted-foreground">
          <strong>References:</strong><br/>
          [1] The Times UK, "Arusha Gallery faces legal battle over unpaid artist fees" (2025).<br/>
          [2] Center for Art Law, "New York Gallery Closures and Legal Impacts for Artists" (2015).
        </p>
      </div>
    `,
    image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?",
    category: "Industry News",
    date: "August 27, 2025",
    author: "Lily Primamore",
    readTime: "8 min read",
    tags: ["Gallery Closures", "Art World Crisis", "Legal Issues", "Artist Rights"]
  },
  'ai-art-discovery': {
    title: "How AI is Helping us Reimagine Art Discovery",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we discover artwork in the digital age.",
    content: `
      <p>Artificial intelligence is transforming every aspect of our lives, and the art world is no exception. From personalized recommendations to automated curation, AI is helping us discover art in ways we never thought possible.</p>
      
      <p>Traditional art discovery relied heavily on physical gallery visits, art fairs, and personal connections. While these methods still have their place, AI-powered platforms are democratizing access to art and making discovery more efficient and personalized.</p>
      
      <p>Machine learning algorithms can analyze vast collections of artwork, identifying patterns and connections that human curators might miss. They can suggest artworks based on a collector's preferences, past purchases, and even emotional responses to different styles and periods.</p>
      
      <p>But AI isn't just about recommendations. It's also about making art more accessible. Natural language processing can help translate complex art historical concepts into simple explanations, making art appreciation more inclusive for everyone.</p>
      
      <p>As we move forward, the challenge will be to ensure that AI enhances rather than replaces the human element in art discovery. The best AI systems work in partnership with human experts, combining the efficiency of algorithms with the nuanced understanding that only human experience can provide.</p>
    `,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?",
    category: "Industry News",
    date: "August 27, 2025",
    author: "ExhibitIQ's Team",
    readTime: "4 min read",
    tags: ["AI", "Art Discovery", "Technology", "Digital Art"]
  },
  'blockchain-art-authentication': {
    title: "Transforming Art Authentication with Blockchain",
    excerpt: "Discover how blockchain is revolutionizing the way we verify artwork authenticity and provenance in the digital age.",
    content: `
      <p>Blockchain technology is revolutionizing art authentication by providing an immutable, transparent record of an artwork's journey from creation to current ownership. This innovation addresses one of the art world's most persistent challenges: establishing and maintaining trust in artwork provenance.</p>
      
      <p>Traditional authentication methods rely on paper certificates, expert opinions, and sometimes incomplete historical records. These methods are vulnerable to forgery, loss, and human error. Blockchain creates a digital ledger that cannot be altered once information is recorded, ensuring the integrity of provenance data.</p>
      
      <p>When an artwork is first registered on the blockchain, it receives a unique digital fingerprint that includes details about the artist, creation date, materials, and initial ownership. Each subsequent transaction, whether it's a sale, loan, or exhibition, is recorded as a new block in the chain, creating a complete and verifiable history.</p>
      
      <p>This technology is particularly valuable for high-value artworks and for establishing the authenticity of digital art, where traditional authentication methods fall short. It also helps combat art forgery and provides collectors with confidence in their investments.</p>
      
      <p>As blockchain adoption grows in the art world, we're seeing new platforms and services emerge that make it easier for artists, galleries, and collectors to participate in this ecosystem. The future of art authentication is digital, transparent, and secure.</p>
    `,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?",
    category: "Industry News",
    date: "August 27, 2025",
    author: "Brian R. Yurachek",
    readTime: "4 min read",
    tags: ["Blockchain", "Authentication", "Provenance", "Digital Art"]
  },
  'future-digital-art-galleries': {
    title: "The Future of Digital Art Galleries",
    excerpt: "Exploring how virtual reality and augmented reality are creating new possibilities for art exhibition and collector engagement.",
    content: `
      <p>The digital revolution has transformed how we experience art, and virtual and augmented reality technologies are taking this transformation to the next level. Digital art galleries are no longer just websites with images—they're immersive, interactive spaces that can be accessed from anywhere in the world.</p>
      
      <p>Virtual reality galleries allow visitors to walk through exhibition spaces as if they were physically present. They can examine artworks from every angle, read detailed information, and even interact with pieces in ways that wouldn't be possible in a traditional gallery setting.</p>
      
      <p>Augmented reality takes this a step further by overlaying digital information onto the real world. Visitors can point their phones at artworks to see additional details, artist interviews, or even animated versions of static pieces.</p>
      
      <p>These technologies are democratizing access to art by eliminating geographical barriers and making exhibitions available 24/7. They're also creating new opportunities for artists to experiment with digital mediums and for collectors to discover works they might never have encountered otherwise.</p>
      
      <p>As these technologies become more sophisticated and accessible, we're likely to see a hybrid approach emerge where physical and digital galleries complement each other, offering visitors the best of both worlds.</p>
    `,
    image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?",
    category: "Industry News",
    date: "August 27, 2025",
    author: "Lily Primamore",
    readTime: "6 min read",
    tags: ["Digital Galleries", "VR", "AR", "Virtual Exhibitions"]
  }
};

export default function NewsDetail() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const article = articles[slug];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Article link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    // This could save to localStorage, user account, or external service
    console.log('Article saved:', article.title);
    alert('Article saved for later!');
  };
  
  if (!article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/news')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/news')}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Article Image */}
          <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {article.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                {article.readTime}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">By {article.author}</span>
                </div>
              </div>
               
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-accent"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-accent"
                  onClick={handleSave}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Article Tags */}
          {article.tags && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Published on {article.date}
                </span>
              </div>
               
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-accent"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-accent"
                  onClick={handleSave}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}
