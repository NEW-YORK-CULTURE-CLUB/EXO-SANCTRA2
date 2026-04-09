'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Instagram,
  Twitter,
  Globe,
  Award,
  Users,
  Eye,
  ArrowRight,
  Tag
} from 'lucide-react';
import { ArtistService } from '@/lib/artist-service';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

function Artists() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  // Fetch artists from database
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const allArtists = await ArtistService.getAllArtistProfiles();
        setArtists(allArtists);
        setFilteredArtists(allArtists);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Filter and search artists
  useEffect(() => {
    let filtered = [...artists];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(artist => 
        artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Category filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(artist => 
        artist.specialties?.includes(activeFilter) ||
        artist.category === activeFilter
      );
    }

    // Sort artists
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.dateJoined) - new Date(a.createdAt || a.dateJoined));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || a.dateJoined) - new Date(b.createdAt || b.dateJoined));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'followers':
        filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        break;
    }

    setFilteredArtists(filtered);
  }, [artists, searchQuery, activeFilter, sortBy]);

  const handleArtistClick = (artist) => {
   router.push(`/marketplace/artist/${artist.id}`);
  };

  const handleFollow = (e, artist) => {
    e.stopPropagation();
    // TODO: Implement follow functionality
    console.log('Follow artist:', artist.name);
  };

  const handleShare = (e, artist) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Check out ${artist.name} on ExhibitIQ`,
        text: artist.bio,
        url: window.location.origin + `/marketplace/artist/${artist.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/marketplace/artist/${artist.id}`);
    }
  };

  const getUniqueSpecialties = () => {
    const specialties = new Set();
    artists.forEach(artist => {
      if (artist.specialties) {
        artist.specialties.forEach(specialty => specialties.add(specialty));
      }
    });
    return Array.from(specialties).slice(0, 8);
  };

  const getMasonryColumns = () => {
    const columns = [[], [], [], []];
    filteredArtists.forEach((artist, index) => {
      columns[index % 4].push(artist);
    });
    return columns;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-muted-foreground">Discover</span>{' '}
              <span className="text-primary">Artists</span>
            </h1>
            <p className="lg:text-xl text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our community of talented artists, creators, and visionaries. 
              Connect with the minds behind the art that moves us.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search artists, specialties, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('All')}
                className="hover:bg-accent"
              >
                All
              </Button>
              {getUniqueSpecialties().map((specialty) => (
                <Button
                  key={specialty}
                  variant={activeFilter === specialty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(specialty)}
                  className="hover:bg-accent"
                >
                  {specialty}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-input rounded-md px-3 py-1 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name A-Z</option>
                <option value="followers">Most Followers</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing {filteredArtists.length} of {artists.length} artists
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-card rounded-2xl overflow-hidden shadow-sm border">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">No artists found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-border/50"
                  onClick={() => handleArtistClick(artist)}
                >
                  {/* Artist Image */}
                  <div className="relative h-64 overflow-hidden">
                    {artist.photoURL ? (
                      <Image
                        src={artist.photoURL}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">
                          {(artist.name || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Follow Button */}
                    {/* <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary backdrop-blur-sm"
                        onClick={(e) => handleFollow(e, artist)}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Follow
                      </Button>
                    </div> */}

                    {/* Share Button */}
                    <div className="absolute top-4 left-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary backdrop-blur-sm"
                        onClick={(e) => handleShare(e, artist)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
                          {artist.name}
                        </h3>
                        {artist.location && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {artist.location}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {artist.bio || 'Artist and creator passionate about bringing unique visions to life.'}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {artist.specialties?.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {artist.specialties?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{artist.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {artist.followers || 0} followers
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {artist.views || 0} views
                      </div>
                    </div>

                    {/* Social Links */}
                    {(artist.instagram || artist.twitter || artist.website) && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                        {artist.instagram && (
                          <Button size="sm" variant="ghost" className="p-2">
                            <Instagram className="w-4 h-4" />
                          </Button>
                        )}
                        {artist.twitter && (
                          <Button size="sm" variant="ghost" className="p-2">
                            <Twitter className="w-4 h-4" />
                          </Button>
                        )}
                        {artist.website && (
                          <Button size="sm" variant="ghost" className="p-2">
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Artists;
