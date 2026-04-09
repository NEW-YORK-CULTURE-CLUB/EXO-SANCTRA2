'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function News() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleArticleClick = (article) => {
    if (article.slug) {
      router.push(`/news/${article.slug}`);
    } else if (article.link) {
      window.open(article.link, '_blank');
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Filter articles based on active filter
  const getFilteredArticles = () => {
    const allArticles = [
      {
        title: "From Puddles to Valleys – What It Takes to Build the Future We Deserve",
        excerpt: "We do not lack the ability to create the future we deserve. That era of limitation ended decades ago. We have the knowledge to decarbonize our energy systems, to design cities that heal instead of deplete, and to build economies that repair as much as they produce.",
        image: "https://static.wixstatic.com/media/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg/v1/fill/w_1390,h_1042,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg",
        category: "Leadership",
        date: "September 5, 2025",
        author: "Brian R. Yurachek",
        readTime: "4 min read",
        link: "https://www.brainzmagazine.com/post/from-puddles-to-valleys-what-it-takes-to-build-the-future-we-deserve"
      },
      {
        title: "Who Owns Color? The Future of the Art Market",
        excerpt: "In 2016 Anish Kapoor reached an agreement granting him exclusive rights to use Vantablack, a pigment that absorbs virtually all light. The move sent shockwaves through the art world.",
        image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6CKg04dkIlW-srhd4qCRJQ.png",
        category: "Industry News",
        date: "August 29, 2025",
        author: "Brian R. Yurachek",
        readTime: "3 min read",
        link: "https://medium.com/@brian_96176/who-owns-color-the-future-of-the-art-market-399e8c8e3832"
      },
      {
        title: "The Hidden Crisis Behind Gallery Closures",
        excerpt: "Arusha Gallery's legal battle over unpaid fees is not an exception but a symptom of an art world still running on trust without infrastructure.",
        image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?",
        category: "Industry News",
        date: "August 27, 2025",
        author: "Lily Primamore",
        readTime: "8 min read",
        link: "https://medium.com/@lily_76419/the-hidden-crisis-behind-gallery-closures-6142edf7f234"
      },
      {
        title: "The Algorithm Ate the Art World",
        excerpt: "In today's galleries, the silent hand of the algorithm is already shaping what we see, how we engage, and what ultimately survives.",
        image: "https://static.wixstatic.com/media/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg/v1/fill/w_1390,h_834,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg",
        category: "Industry News",
        date: "August 15, 2025",
        author: "Brian R. Yurachek",
        readTime: "5 min read",
        link: "https://www.brainzmagazine.com/post/the-algorithm-ate-the-art-world-and-how-data-is-rewriting-gallery-culture"
      }
    ];

    if (activeFilter === 'All') {
      return allArticles;
    }
    
    return allArticles.filter(article => article.category === activeFilter);
  };

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more articles');
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionMessage('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        setSubscriptionMessage('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setSubscriptionMessage('An error occurred. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleFeaturedArticleClick = () => {
    // TODO: Implement featured article navigation
    // This could redirect to a specific article page or open a modal
    console.log('Featured article clicked');
    // For now, we'll redirect to a placeholder article page
    router.push('/news/exhibitiq-launches-revolutionary-operating-system');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?"
              alt="News and media background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-muted-foreground">Latest </span>
                <span className="text-foreground">News </span>
                <span className="text-muted-foreground">& </span>
                <span className="text-foreground">Updates</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-0 max-w-2xl mx-auto px-4">
                Stay informed about the latest developments in the art world, ExhibitIQ platform updates, and insights from our team of industry experts.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article Section */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 sm:h-80 lg:h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1729786423717-07716ec501e9?"
                    alt="Featured article image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">Featured</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      August 15, 2025
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-light mb-4 text-foreground">
                    ExhibitIQ Launches Revolutionary Operating System
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                    We're excited to announce the launch of our Operating System, a breakthrough technology that securely stores and syncs artwork data for seamless display across both physical and digital platforms. This innovation represents a significant step forward in bridging the gap between traditional art presentation and modern digital experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By ExhibitIQ Team</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        5 min read
                      </div>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                      onClick={handleFeaturedArticleClick}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Grid Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground">Latest Articles</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  variant={activeFilter === 'All' ? 'default' : 'outline'} 
                  size="sm" 
                  className="hover:bg-accent flex-shrink-0"
                  onClick={() => handleFilterClick('All')}
                >
                  All
                </Button>
                <Button 
                  variant={activeFilter === 'Industry News' ? 'default' : 'outline'} 
                  size="sm" 
                  className="hover:bg-accent flex-shrink-0"
                  onClick={() => handleFilterClick('Industry News')}
                >
                  Industry News
                </Button>
                <Button 
                  variant={activeFilter === 'Leadership' ? 'default' : 'outline'} 
                  size="sm" 
                  className="hover:bg-accent flex-shrink-0"
                  onClick={() => handleFilterClick('Leadership')}
                >
                  Leadership
                </Button>
                <Button 
                  variant={activeFilter === 'Platform Updates' ? 'default' : 'outline'} 
                  size="sm" 
                  className="hover:bg-accent flex-shrink-0"
                  onClick={() => handleFilterClick('Platform Updates')}
                >
                  Platform Updates
                </Button>
              </div>
            </div>
            
            {getFilteredArticles().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                  <Tag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try selecting a different category or check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {getFilteredArticles().map((article, index) => (
                  <article key={index} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleArticleClick(article)}>
                    <div className="relative h-48">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">{article.category}</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {article.date}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-3 text-foreground text-lg leading-tight">{article.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>By {article.author}</span>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full hover:bg-accent">
                        {article.slug ? 'Read Article' : 'Read External Article'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg" 
                className="hover:bg-accent"
                onClick={handleLoadMore}
              >
                Load More Articles
              </Button>
            </div> */}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light mb-6 text-foreground">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news, platform updates, and industry insights directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            {subscriptionMessage && (
              <p className={`text-sm mt-4 ${subscriptionMessage.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {subscriptionMessage}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default News
