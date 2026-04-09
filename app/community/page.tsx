'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, MessageCircle, Heart, Share2, Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Community() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', color: 'bg-gray-100 text-gray-800' },
    { id: 'artwork', name: 'Artwork', color: 'bg-blue-100 text-blue-800' },
    { id: 'exhibitions', name: 'Exhibitions', color: 'bg-green-100 text-green-800' },
    { id: 'technology', name: 'Technology', color: 'bg-purple-100 text-purple-800' },
    { id: 'marketplace', name: 'Marketplace', color: 'bg-orange-100 text-orange-800' },
    { id: 'general', name: 'General', color: 'bg-pink-100 text-pink-800' }
  ];

  const communityPosts = [
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: '/placeholder-user.jpg',
      category: 'artwork',
      title: 'My latest digital art collection inspired by nature',
      content: 'Just finished a series of digital paintings exploring the relationship between technology and natural forms. Each piece is available as an NFT on our marketplace!',
      image: '/artwork-1.png',
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ['digital art', 'nature', 'NFT', 'collection'],
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Marcus Rodriguez',
      avatar: '/placeholder-user.jpg',
      category: 'exhibitions',
      title: 'Upcoming virtual gallery opening this weekend',
      content: 'Excited to announce our first fully virtual exhibition featuring emerging artists from around the world. Join us this Saturday for the live opening!',
      image: '/artwork-2.png',
      likes: 18,
      comments: 12,
      shares: 7,
      tags: ['virtual exhibition', 'opening', 'emerging artists', 'live event'],
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      author: 'Emma Thompson',
      avatar: '/placeholder-user.jpg',
      category: 'technology',
      title: 'How blockchain is revolutionizing art authentication',
      content: 'Fascinating to see how blockchain technology is being used to create immutable records of artwork provenance. This could change everything about how we verify authenticity.',
      image: '/artwork-3.png',
      likes: 31,
      comments: 15,
      shares: 9,
      tags: ['blockchain', 'authentication', 'provenance', 'technology'],
      timestamp: '1 day ago'
    },
    {
      id: 4,
      author: 'David Kim',
      avatar: '/placeholder-user.jpg',
      category: 'marketplace',
      title: 'Tips for pricing your artwork competitively',
      content: 'After selling over 50 pieces on the platform, here are my insights on setting the right price for your artwork. It\'s all about understanding your market and audience.',
      image: '/artwork-4.png',
      likes: 42,
      comments: 23,
      shares: 11,
      tags: ['pricing', 'marketplace', 'tips', 'selling'],
      timestamp: '2 days ago'
    }
  ];

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = [
    {
      title: 'Digital Art Workshop',
      date: 'Dec 15, 2024',
      time: '2:00 PM EST',
      location: 'Virtual',
      attendees: 45
    },
    {
      title: 'Gallery Owner Meetup',
      date: 'Dec 20, 2024',
      time: '6:00 PM EST',
      location: 'New York, NY',
      attendees: 23
    },
    {
      title: 'Artist Networking Event',
      date: 'Dec 28, 2024',
      time: '7:00 PM EST',
      location: 'Los Angeles, CA',
      attendees: 67
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users className="w-12 h-12 text-primary" />
                <h1 className="text-4xl font-bold">
                  <span className="text-muted-foreground">Community</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with artists, collectors, and art enthusiasts. Share your work, discover new talent, and engage in meaningful discussions about art and technology.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search posts, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Create New Post */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Share something with the community..."
                    className="border-0 bg-transparent focus-visible:ring-0 text-lg"
                  />
                </div>
                <Button size="lg">Create Post</Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Community Posts */}
              <div className="lg:col-span-2 space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{post.author}</span>
                          <Badge variant="secondary" className="text-xs">
                            {categories.find(c => c.id === post.category)?.name}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.content}</p>

                    {post.image && (
                      <div className="mb-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Community Highlights */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Community Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">New Members</p>
                        <p className="text-sm text-muted-foreground">+127 this week</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Active Discussions</p>
                        <p className="text-sm text-muted-foreground">89 ongoing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Total Interactions</p>
                        <p className="text-sm text-muted-foreground">2.4k today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{event.attendees} attending</span>
                          <Button size="sm" variant="outline">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Find Artists
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Discussion
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
