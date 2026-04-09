import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, TrendingDown, Eye, QrCode, DollarSign, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AnalyticsService from '@/lib/analytics-service';

interface AnalyticsDashboardProps {
  timePeriod?: {
    start: Date;
    end: Date;
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  timePeriod = {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    end: new Date()
  }
}) => {
  const { user, userData } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      // Get gallery ID from user data
      let galleryId = null;
      
      if (userData?.gallery) {
        // If user has multiple galleries, use the first one
        const galleries = Object.values(userData.gallery);
        if (galleries.length > 0) {
          galleryId = galleries[0].galleryId;
        }
      }
      
      if (!galleryId) {
        setError('No gallery ID found. Please ensure you are logged in as a gallery owner.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const analyticsService = AnalyticsService.getInstance();
        const data = await analyticsService.getGalleryAnalytics(
          galleryId,
          timePeriod
        );
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userData?.gallery, timePeriod]);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading analytics</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { overview } = analyticsData;

  const stats = [
    {
      title: 'QR Scans',
      value: overview.totalQRScans,
      icon: QrCode,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Artwork Views',
      value: overview.totalArtworkViews,
      icon: Eye,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Unique Visitors',
      value: overview.uniqueVisitors,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Revenue',
      value: `$${overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+22%',
      trendUp: true
    },
    {
      title: 'Avg Time Spent',
      value: `${overview.averageTimeSpent} min`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Conversion Rate',
      value: `${overview.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+5%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">
            {new Date(timePeriod.start).toLocaleDateString()} - {new Date(timePeriod.end).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Last 7 days
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center text-xs ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Generate reports and export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              Share Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 