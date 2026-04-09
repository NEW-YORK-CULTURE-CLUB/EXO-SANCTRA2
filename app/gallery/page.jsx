"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Heart, Share2, Eye, Filter, Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { UnifiedItemService } from '@/lib/unified-item-service'
import { Badge } from '@/components/ui/badge'

function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(8)
  const [hasMore, setHasMore] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const router = useRouter()

  // Fetch all items from database using unified service
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const result = await UnifiedItemService.getAllItems(100) // Get more items for filtering
        setItems(result.items)
        setFilteredItems(result.items)
        setHasMore(result.items.length > 8)
      } catch (error) {
        console.error('Error fetching items:', error)
        setItems([])
        setFilteredItems([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Filter items based on active filter and search term
  useEffect(() => {
    let filtered = items

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.collectionSource === activeFilter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.artist?.toLowerCase().includes(searchLower) ||
        item.makerManufacturer?.toLowerCase().includes(searchLower) ||
        item.manufacturerBrand?.toLowerCase().includes(searchLower) ||
        item.medium?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredItems(filtered)
    setHasMore(filtered.length > displayCount)
  }, [items, activeFilter, searchTerm, displayCount])

  const handleLoadMore = () => {
    const newCount = displayCount + 8
    setDisplayCount(newCount)
    setHasMore(newCount < filteredItems.length)
  }

  const displayedItems = filteredItems.slice(0, displayCount)

  const getItemDisplayInfo = (item) => {
    switch (item.collectionSource) {
      case 'Artwork':
        return {
          creator: item.artist || 'Unknown Artist',
          year: item.year || 'Unknown Year',
          medium: item.medium || 'Unknown Medium',
          type: 'Artwork'
        }
      case 'Objects':
        return {
          creator: item.makerManufacturer || 'Unknown Maker',
          year: item.productionYearEra || 'Unknown Era',
          medium: item.materialsComposition || 'Unknown Materials',
          type: 'Object'
        }
      case 'Collectibles':
        return {
          creator: item.manufacturerBrand || 'Unknown Brand',
          year: item.releaseYearEra || 'Unknown Era',
          medium: item.seriesSetName || 'Unknown Series',
          type: 'Collectible'
        }
      case 'Memorabilia':
        return {
          creator: item.associatedPersons || 'Unknown Person',
          year: item.eraPeriod || 'Unknown Era',
          medium: item.eventNameDate || 'Unknown Event',
          type: 'Memorabilia'
        }
      default:
        return {
          creator: 'Unknown Creator',
          year: 'Unknown Year',
          medium: 'Unknown Medium',
          type: 'Item'
        }
    }
  }

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      const firstImage = item.images[0]
      if (typeof firstImage === 'string') {
        return firstImage
      } else if (firstImage && typeof firstImage === 'object' && firstImage.variants) {
        // Return the highest quality variant URL
        const highestQualityVariant = firstImage.variants.reduce((prev, current) => 
          (current.width > prev.width) ? current : prev
        )
        return highestQualityVariant.url
      }
    }
    return "/vault/artwork-1.png" // Fallback image
  }

  const handleItemClick = (item) => {
    router.push(`/marketplace/${item.id}`)
  }

  const filterOptions = [
    { value: 'all', label: 'All Items', count: items.length },
    { value: 'Artwork', label: 'Artwork', count: items.filter(i => i.collectionSource === 'Artwork').length },
    { value: 'Objects', label: 'Objects', count: items.filter(i => i.collectionSource === 'Objects').length },
    { value: 'Collectibles', label: 'Collectibles', count: items.filter(i => i.collectionSource === 'Collectibles').length },
    { value: 'Memorabilia', label: 'Memorabilia', count: items.filter(i => i.collectionSource === 'Memorabilia').length }
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?"
              alt="Art gallery background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-muted-foreground">Our </span>
                <span className="text-foreground">Gallery</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore our curated collection of fine art, objects, collectibles, and memorabilia
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-background border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items, artists, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className="hover:bg-accent"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h2 className="text-3xl font-light text-foreground mb-4 sm:mb-0">
                {activeFilter === 'all' ? 'All Items' : `${activeFilter}s`}
              </h2>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredItems.length} items found`}
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-xl mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-20">🔍</div>
                <h3 className="text-xl font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setActiveFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedItems.map((item, index) => {
                    const itemInfo = getItemDisplayInfo(item)
                    const itemImage = getItemImage(item)
                    
                    return (
                      <div 
                        key={item.id || index} 
                        className="group cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="h-64 rounded-xl mb-4 overflow-hidden group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 relative">
                          <img 
                            src={itemImage} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/vault/artwork-1.png"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                          
                          {/* Item type badge */}
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="text-xs">
                              {itemInfo.type}
                            </Badge>
                          </div>
                          
                          {/* Mature content warning */}
                          {item.matureContent === 'Yes' && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="destructive" className="text-xs">
                                🔞 18+
                              </Badge>
                            </div>
                          )}
                          
                          {/* Action buttons */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/90 hover:bg-background">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/90 hover:bg-background">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/90 hover:bg-background">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-1 text-foreground group-hover:text-primary transition-colors">
                          {itemInfo.creator}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {item.title || 'Untitled'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {itemInfo.year}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {itemInfo.medium}
                          </p>
                        </div>
                        
                        {/* Price */}
                        {item.price && (
                          <p className="text-sm font-medium text-primary mt-2">
                            ${item.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button 
                      onClick={handleLoadMore}
                      variant="outline" 
                      size="lg"
                      className="hover:bg-accent"
                    >
                      Load More Items
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Collections Section */}
        {/* <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-8 text-foreground">Collections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  title: "Fine Art", 
                  description: "Contemporary and classical artworks", 
                  count: items.filter(i => i.collectionSource === 'Artwork').length,
                  icon: "🎨"
                },
                { 
                  title: "Design Objects", 
                  description: "Furniture, ceramics, and decorative arts", 
                  count: items.filter(i => i.collectionSource === 'Objects').length,
                  icon: "🪑"
                },
                { 
                  title: "Collectibles", 
                  description: "Limited editions and rare finds", 
                  count: items.filter(i => i.collectionSource === 'Collectibles').length,
                  icon: "🏆"
                },
                { 
                  title: "Memorabilia", 
                  description: "Historical artifacts and personal items", 
                  count: items.filter(i => i.collectionSource === 'Memorabilia').length,
                  icon: "📜"
                }
              ].map((collection, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">{collection.icon}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{collection.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">{collection.count} items</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const filterValue = collection.title === 'Fine Art' ? 'Artwork' : 
                                       collection.title === 'Design Objects' ? 'Objects' : 
                                       collection.title
                      setActiveFilter(filterValue)
                    }}
                  >
                    Explore Collection
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  )
}

export default Gallery 