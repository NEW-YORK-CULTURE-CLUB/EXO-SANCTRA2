'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Star, TrendingUp, Users, Award, Crown, Medal, Target, Building2, Palette } from 'lucide-react';
import { ReputationService, REPUTATION_LEVELS } from '@/lib/reputation-service';
import { ReputationDisplay } from '@/components/reputation-score';

export default function ReputationDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [topGalleries, setTopGalleries] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topCollectors, setTopCollectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, galleries, artists, collectors] = await Promise.all([
          ReputationService.getReputationStats(),
          ReputationService.getTopUsers('gallery', 10),
          ReputationService.getTopUsers('artist', 10),
          ReputationService.getTopUsers('collector', 10)
        ]);
        
        setStats(statsData);
        setTopGalleries(galleries);
        setTopArtists(artists);
        setTopCollectors(collectors);
      } catch (error) {
        console.error('Error loading reputation data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted/20 rounded w-64"></div>
            <div className="h-4 bg-muted/20 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted/20 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold">IQ Score Dashboard</h1>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your reputation and earn rewards through active participation in the Exhibit-IQ community
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average IQ Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats?.averageScore || 0)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Luminary Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.levelDistribution?.LUMINARY || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Established Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.levelDistribution?.ESTABLISHED || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Community Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(REPUTATION_LEVELS).map(([level, info]) => {
                const count = stats?.levelDistribution?.[level] || 0;
                const percentage = stats?.totalUsers ? Math.round((count / stats.totalUsers) * 100) : 0;
                
                return (
                  <div key={level} className="text-center p-4 rounded-lg border">
                    <div className={`text-2xl font-bold mb-2 ${
                      level === 'LUMINARY' ? 'text-yellow-600' :
                      level === 'ESTABLISHED' ? 'text-blue-600' :
                      level === 'CONTRIBUTOR' ? 'text-green-600' :
                      level === 'EXPLORER' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {count}
                    </div>
                    <div className="text-sm font-medium mb-1">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {info.discount}% discount
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Users Tabs */}
        <Tabs defaultValue="galleries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="galleries" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Top Galleries
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Top Artists
            </TabsTrigger>
            <TabsTrigger value="collectors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Top Collectors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="galleries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Top Performing Galleries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topGalleries.map((gallery, index) => (
                    <div key={gallery.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Medal className="w-4 h-4 text-orange-500" />}
                          {index > 2 && <span className="text-sm font-medium">{index + 1}</span>}
                        </div>
                        <div>
                          <div className="font-medium">Gallery {gallery.userId}</div>
                          <div className="text-sm text-muted-foreground">
                            {gallery.totalActions} actions • {gallery.positiveActions} positive
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{gallery.currentScore}</div>
                        <Badge variant="secondary">{REPUTATION_LEVELS[gallery.level].name}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Top Performing Artists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topArtists.map((artist, index) => (
                    <div key={artist.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Medal className="w-4 h-4 text-orange-500" />}
                          {index > 2 && <span className="text-sm font-medium">{index + 1}</span>}
                        </div>
                        <div>
                          <div className="font-medium">Artist {artist.userId}</div>
                          <div className="text-sm text-muted-foreground">
                            {artist.totalActions} actions • {artist.positiveActions} positive
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{artist.currentScore}</div>
                        <Badge variant="secondary">{REPUTATION_LEVELS[artist.level].name}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collectors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Top Performing Collectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCollectors.map((collector, index) => (
                    <div key={collector.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Medal className="w-4 h-4 text-orange-500" />}
                          {index > 2 && <span className="text-sm font-medium">{index + 1}</span>}
                        </div>
                        <div>
                          <div className="font-medium">Collector {collector.userId}</div>
                          <div className="text-sm text-muted-foreground">
                            {collector.totalActions} actions • {collector.positiveActions} positive
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{collector.currentScore}</div>
                        <Badge variant="secondary">{REPUTATION_LEVELS[collector.level].name}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              How IQ Scores Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Earning Points</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Upload artwork: +2-3 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Successful sales: +3-5 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Positive reviews: +2-4 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Community engagement: +1-2 points</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Level Benefits</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Luminary</Badge>
                    <span>20% subscription discount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Established</Badge>
                    <span>15% subscription discount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Contributor</Badge>
                    <span>10% subscription discount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Explorer</Badge>
                    <span>5% subscription discount</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
