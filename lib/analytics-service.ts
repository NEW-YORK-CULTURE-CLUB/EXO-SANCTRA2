import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { ANALYTICS_CONFIG, shouldTrackEvent, getRateLimit } from './analytics-config';

// Analytics Event Types
export enum AnalyticsEventType {
  QR_SCAN = 'qr_scan',
  ARTWORK_VIEW = 'artwork_view',
  ARTWORK_INQUIRY = 'artwork_inquiry',
  GALLERY_VIEW = 'gallery_view',
  ARTIST_VIEW = 'artist_view',
  MARKETPLACE_VIEW = 'marketplace_view',
  DIGITAL_FLOOR_VIEW = 'digital_floor_view',
  FAVORITE_TOGGLE = 'favorite_toggle',
  SHARE_ARTWORK = 'share_artwork',
  IMAGE_ZOOM = 'image_zoom',
  VIDEO_PLAY = 'video_play',
  TIME_SPENT = 'time_spent',
  PAGE_EXIT = 'page_exit'
}

// Analytics Event Interface - Simplified
export interface AnalyticsEvent {
  id?: string;
  eventType: AnalyticsEventType;
  galleryId: string;
  galleryName: string;
  artistId?: string;
  artistName?: string;
  artworkId?: string;
  artworkTitle?: string;
  userId?: string;
  userType?: 'anonymous' | 'registered' | 'gallery_owner' | 'artist';
  sessionId: string;
  timestamp: Timestamp;
  // Simplified metadata - only essential data
  metadata?: {
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    [key: string]: any;
  };
  duration?: number; // in seconds
  value?: number; // for monetary values or other metrics
}

// Analytics Metrics Interface
export interface AnalyticsMetrics {
  totalQRScans: number;
  totalArtworkViews: number;
  totalInquiries: number;
  totalRevenue: number;
  averageTimeSpent: number;
  uniqueVisitors: number;
  conversionRate: number;
}

// Time Period Interface
export interface TimePeriod {
  start: Date;
  end: Date;
}

// Analytics Service Class - Optimized
export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private eventQueue: Omit<AnalyticsEvent, 'id'>[] = [];
  private batchSize: number = ANALYTICS_CONFIG.BATCHING.BATCH_SIZE;
  private flushInterval: number = ANALYTICS_CONFIG.BATCHING.FLUSH_INTERVAL;
  private lastFlush: number = Date.now();
  private rateLimitMap: Map<string, number> = new Map();

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startPeriodicFlush();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Rate limiting to prevent abuse
  private isRateLimited(eventType: string, key: string): boolean {
    const now = Date.now();
    const rateLimitKey = `${eventType}:${key}`;
    const lastEvent = this.rateLimitMap.get(rateLimitKey);
    const rateLimitWindow = getRateLimit(eventType);
    
    if (lastEvent && (now - lastEvent) < rateLimitWindow) {
      return true;
    }
    
    this.rateLimitMap.set(rateLimitKey, now);
    return false;
  }

  // Start periodic flush of events
  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  // Flush events to database
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const batch = writeBatch(db);
    const eventsToProcess = this.eventQueue.splice(0, this.batchSize);

    try {
      for (const event of eventsToProcess) {
        const docRef = doc(collection(db, 'analytics_events'));
        batch.set(docRef, event);
      }

      await batch.commit();
      this.lastFlush = Date.now();
      console.log(`Flushed ${eventsToProcess.length} analytics events`);
    } catch (error) {
      console.error('Error flushing analytics events:', error);
      // Re-add events to queue on failure
      this.eventQueue.unshift(...eventsToProcess);
    }
  }

  // Queue event instead of immediate save
  private async queueEvent(event: Omit<AnalyticsEvent, 'id'>): Promise<void> {
    // Check sampling first
    if (!shouldTrackEvent(event.eventType)) {
      return;
    }

    // Validate event data before queuing
    const validatedEvent = this.validateEvent(event);
    if (!validatedEvent) {
      console.warn('Invalid analytics event, skipping:', event);
      return;
    }

    this.eventQueue.push(validatedEvent);
    
    // Flush immediately if batch is full or queue is too large
    if (this.eventQueue.length >= this.batchSize || this.eventQueue.length >= ANALYTICS_CONFIG.BATCHING.MAX_QUEUE_SIZE) {
      await this.flushEvents();
    }
  }

  // Validate event data to ensure no undefined values are sent to Firebase
  private validateEvent(event: Omit<AnalyticsEvent, 'id'>): Omit<AnalyticsEvent, 'id'> | null {
    // Remove any undefined values from the event
    const cleanedEvent = { ...event };
    
    // Remove undefined duration
    if (cleanedEvent.duration === undefined || cleanedEvent.duration === null || isNaN(cleanedEvent.duration) || cleanedEvent.duration < 0) {
      delete cleanedEvent.duration;
    }
    
    // Remove undefined value
    if (cleanedEvent.value === undefined || cleanedEvent.value === null || isNaN(cleanedEvent.value) || cleanedEvent.value < 0) {
      delete cleanedEvent.value;
    }
    
    // Remove undefined metadata
    if (cleanedEvent.metadata === undefined || cleanedEvent.metadata === null) {
      delete cleanedEvent.metadata;
    }
    
    // Remove undefined optional fields
    if (cleanedEvent.artistId === undefined || cleanedEvent.artistId === null || cleanedEvent.artistId === '') {
      delete cleanedEvent.artistId;
    }
    
    if (cleanedEvent.artistName === undefined || cleanedEvent.artistName === null || cleanedEvent.artistName === '') {
      delete cleanedEvent.artistName;
    }
    
    if (cleanedEvent.artworkId === undefined || cleanedEvent.artworkId === null || cleanedEvent.artworkId === '') {
      delete cleanedEvent.artworkId;
    }
    
    if (cleanedEvent.artworkTitle === undefined || cleanedEvent.artworkTitle === null || cleanedEvent.artworkTitle === '') {
      delete cleanedEvent.artworkTitle;
    }
    
    if (cleanedEvent.userId === undefined || cleanedEvent.userId === null || cleanedEvent.userId === '') {
      delete cleanedEvent.userId;
    }
    
    if (cleanedEvent.userType === undefined || cleanedEvent.userType === null) {
      delete cleanedEvent.userType;
    }
    
    // Ensure required fields are present
    if (!cleanedEvent.galleryId || !cleanedEvent.galleryName || !cleanedEvent.eventType || !cleanedEvent.sessionId) {
      console.warn('Missing required fields in analytics event:', cleanedEvent);
      return null;
    }
    
    return cleanedEvent;
  }

  // Track QR Code Scan - with rate limiting
  async trackQRScan(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit QR scans per artwork
    if (this.isRateLimited('qr_scan', artworkId)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.QR_SCAN,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Artwork View - with rate limiting
  async trackArtworkView(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous',
    duration?: number
  ): Promise<void> {
    // Rate limit views per artwork per session
    if (this.isRateLimited('artwork_view', `${artworkId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.ARTWORK_VIEW,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      ...(duration && !isNaN(duration) && duration > 0 && { duration }),
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Artwork Inquiry - with rate limiting
  async trackArtworkInquiry(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    inquiryValue: number,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit inquiries per artwork per user
    if (this.isRateLimited('artwork_inquiry', `${artworkId}:${userId || 'anonymous'}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.ARTWORK_INQUIRY,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      ...(inquiryValue && !isNaN(inquiryValue) && inquiryValue >= 0 && { value: inquiryValue }),
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Gallery View - with rate limiting
  async trackGalleryView(
    galleryId: string,
    galleryName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit gallery views per session
    if (this.isRateLimited('gallery_view', `${galleryId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.GALLERY_VIEW,
      galleryId,
      galleryName,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Artist View - with rate limiting
  async trackArtistView(
    galleryId: string,
    galleryName: string,
    artistId: string,
    artistName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit artist views per session
    if (this.isRateLimited('artist_view', `${artistId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.ARTIST_VIEW,
      galleryId,
      galleryName,
      artistId,
      artistName,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Marketplace View - with rate limiting
  async trackMarketplaceView(
    galleryId: string,
    galleryName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit marketplace views per session
    if (this.isRateLimited('marketplace_view', `${galleryId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.MARKETPLACE_VIEW,
      galleryId,
      galleryName,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Digital Floor View - with rate limiting
  async trackDigitalFloorView(
    galleryId: string,
    galleryName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit digital floor views per session
    if (this.isRateLimited('digital_floor_view', `${galleryId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.DIGITAL_FLOOR_VIEW,
      galleryId,
      galleryName,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Favorite Toggle - with rate limiting
  async trackFavoriteToggle(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    isFavorited: boolean,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit favorite toggles per artwork per user
    if (this.isRateLimited('favorite_toggle', `${artworkId}:${userId || 'anonymous'}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.FAVORITE_TOGGLE,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
        isFavorited,
      }
    };

    await this.queueEvent(event);
  }

  // Track Share Artwork - with rate limiting
  async trackShareArtwork(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    shareMethod: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit shares per artwork per user
    if (this.isRateLimited('share_artwork', `${artworkId}:${userId || 'anonymous'}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.SHARE_ARTWORK,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
        shareMethod,
      }
    };

    await this.queueEvent(event);
  }

  // Track Image Zoom - with rate limiting
  async trackImageZoom(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit image zooms per artwork per session
    if (this.isRateLimited('image_zoom', `${artworkId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.IMAGE_ZOOM,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Track Video Play - with rate limiting
  async trackVideoPlay(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    videoPlatform: string,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Rate limit video plays per artwork per session
    if (this.isRateLimited('video_play', `${artworkId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.VIDEO_PLAY,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      metadata: {
        deviceType: this.getDeviceType(),
        videoPlatform,
      }
    };

    await this.queueEvent(event);
  }

  // Track Time Spent - with rate limiting
  async trackTimeSpent(
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    duration: number,
    userId?: string,
    userType: 'anonymous' | 'registered' | 'gallery_owner' | 'artist' = 'anonymous'
  ): Promise<void> {
    // Validate duration is a valid positive number
    if (!duration || isNaN(duration) || duration <= 0) {
      console.warn('Invalid duration provided to trackTimeSpent:', duration);
      return;
    }

    // Only track time spent if duration is significant
    if (duration < ANALYTICS_CONFIG.THRESHOLDS.MIN_TIME_SPENT) {
      return;
    }

    // Rate limit time spent tracking per artwork per session
    if (this.isRateLimited('time_spent', `${artworkId}:${this.sessionId}`)) {
      return;
    }

    const event: Omit<AnalyticsEvent, 'id'> = {
      eventType: AnalyticsEventType.TIME_SPENT,
      galleryId,
      galleryName,
      artistId,
      artistName,
      artworkId,
      artworkTitle,
      userId,
      userType,
      sessionId: this.sessionId,
      timestamp: serverTimestamp() as Timestamp,
      duration,
      metadata: {
        deviceType: this.getDeviceType(),
      }
    };

    await this.queueEvent(event);
  }

  // Force flush remaining events (call on page unload)
  async forceFlush(): Promise<void> {
    await this.flushEvents();
  }

  // Get Device Type
  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Get Analytics Data for Gallery
  async getGalleryAnalytics(
    galleryId: string,
    timePeriod: TimePeriod
  ): Promise<{
    overview: any;
    qrScans: any;
    artworkViews: any;
    digitalFloor: any;
    sales: any;
    topPerformers: any;
  }> {
    const startTimestamp = Timestamp.fromDate(timePeriod.start);
    const endTimestamp = Timestamp.fromDate(timePeriod.end);

    const eventsQuery = query(
      collection(db, 'analytics_events'),
      where('galleryId', '==', galleryId),
      where('timestamp', '>=', startTimestamp),
      where('timestamp', '<=', endTimestamp)
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      overview: this.processOverviewData(events),
      qrScans: this.processQRScansData(events),
      artworkViews: this.processArtworkViewsData(events),
      digitalFloor: this.processDigitalFloorData(events),
      sales: this.processSalesData(events),
      topPerformers: this.processTopPerformersData(events)
    };
  }

  // Process Overview Data
  private processOverviewData(events: any[]): any {
    // Handle both old and new data formats
    const qrScans = events.filter(e => e.eventType === AnalyticsEventType.QR_SCAN || e.eventType === 'qr_scan').length;
    const artworkViews = events.filter(e => e.eventType === AnalyticsEventType.ARTWORK_VIEW || e.eventType === 'artwork_view').length;
    const digitalFloorViews = events.filter(e => e.eventType === AnalyticsEventType.DIGITAL_FLOOR_VIEW || e.eventType === 'digital_floor_view').length;
    const inquiries = events.filter(e => e.eventType === AnalyticsEventType.ARTWORK_INQUIRY || e.eventType === 'artwork_inquiry');
    const totalRevenue = inquiries.reduce((sum, e) => sum + (e.value || 0), 0);
    const uniqueVisitors = new Set(events.map(e => e.sessionId)).size;
    const totalTimeSpent = events
      .filter(e => e.eventType === AnalyticsEventType.TIME_SPENT || e.eventType === 'time_spent')
      .reduce((sum, e) => sum + (e.duration || 0), 0);
    const averageTimeSpent = totalTimeSpent / artworkViews || 0;

    return {
      totalQRScans: qrScans,
      totalArtworkViews: artworkViews,
      totalDigitalFloorViews: digitalFloorViews,
      totalRevenue,
      totalInquiries: inquiries.length,
      uniqueVisitors,
      averageTimeSpent: Math.round(averageTimeSpent / 60), // Convert to minutes
      conversionRate: artworkViews > 0 ? (inquiries.length / artworkViews * 100) : 0
    };
  }

  // Process QR Scans Data
  private processQRScansData(events: any[]): any {
    const qrScans = events.filter(e => e.eventType === AnalyticsEventType.QR_SCAN || e.eventType === 'qr_scan');
    
    // Group by date
    const dailyScans = qrScans.reduce((acc, event) => {
      const date = event.timestamp?.toDate?.()?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Group by artwork
    const artworkScans = qrScans.reduce((acc, event) => {
      const key = event.artworkId;
      if (!acc[key]) {
        acc[key] = {
          artworkId: event.artworkId,
          artworkTitle: event.artworkTitle,
          artistName: event.artistName,
          scans: 0
        };
      }
      acc[key].scans += 1;
      return acc;
    }, {});

    return {
      totalScans: qrScans.length,
      dailyScans: Object.entries(dailyScans).map(([date, count]) => ({ date, count })),
      topScannedArtworks: Object.values(artworkScans)
        .sort((a: any, b: any) => b.scans - a.scans)
        .slice(0, 10)
    };
  }

  // Process Artwork Views Data
  private processArtworkViewsData(events: any[]): any {
    const artworkViews = events.filter(e => e.eventType === AnalyticsEventType.ARTWORK_VIEW);
    
    // Group by date
    const dailyViews = artworkViews.reduce((acc, event) => {
      const date = event.timestamp.toDate().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Group by artwork
    const artworkViewCounts = artworkViews.reduce((acc, event) => {
      const key = event.artworkId;
      if (!acc[key]) {
        acc[key] = {
          artworkId: event.artworkId,
          artworkTitle: event.artworkTitle,
          artistName: event.artistName,
          views: 0,
          totalTimeSpent: 0
        };
      }
      acc[key].views += 1;
      return acc;
    }, {});

    // Add time spent data
    const timeSpentEvents = events.filter(e => e.eventType === AnalyticsEventType.TIME_SPENT);
    timeSpentEvents.forEach(event => {
      if (artworkViewCounts[event.artworkId]) {
        artworkViewCounts[event.artworkId].totalTimeSpent += event.duration || 0;
      }
    });

    return {
      totalViews: artworkViews.length,
      dailyViews: Object.entries(dailyViews).map(([date, count]) => ({ date, count })),
      mostViewedArtworks: Object.values(artworkViewCounts)
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 10)
    };
  }

  // Process Digital Floor Data
  private processDigitalFloorData(events: any[]): any {
    const digitalFloorViews = events.filter(e => e.eventType === AnalyticsEventType.DIGITAL_FLOOR_VIEW);
    
    // Group by date
    const dailyViews = digitalFloorViews.reduce((acc, event) => {
      const date = event.timestamp.toDate().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalViews: digitalFloorViews.length,
      dailyViews: Object.entries(dailyViews).map(([date, count]) => ({ date, count })),
      uniqueVisitors: new Set(digitalFloorViews.map(e => e.sessionId)).size
    };
  }

  // Process Sales Data
  private processSalesData(events: any[]): any {
    const inquiries = events.filter(e => e.eventType === AnalyticsEventType.ARTWORK_INQUIRY);
    
    // Group by date
    const dailyRevenue = inquiries.reduce((acc, event) => {
      const date = event.timestamp.toDate().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (event.value || 0);
      return acc;
    }, {});

    // Group by artwork
    const artworkRevenue = inquiries.reduce((acc, event) => {
      const key = event.artworkId;
      if (!acc[key]) {
        acc[key] = {
          artworkId: event.artworkId,
          artworkTitle: event.artworkTitle,
          artistName: event.artistName,
          revenue: 0,
          inquiries: 0
        };
      }
      acc[key].revenue += event.value || 0;
      acc[key].inquiries += 1;
      return acc;
    }, {});

    return {
      totalRevenue: inquiries.reduce((sum, e) => sum + (e.value || 0), 0),
      totalInquiries: inquiries.length,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })),
      topSellingArtworks: Object.values(artworkRevenue)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10)
    };
  }

  // Process Top Performers Data
  private processTopPerformersData(events: any[]): any {
    // Top performing artworks
    const artworkViews = events.filter(e => e.eventType === AnalyticsEventType.ARTWORK_VIEW);
    const artworkPerformance = artworkViews.reduce((acc, event) => {
      const key = event.artworkId;
      if (!acc[key]) {
        acc[key] = {
          artworkId: event.artworkId,
          artworkTitle: event.artworkTitle,
          artistName: event.artistName,
          views: 0
        };
      }
      acc[key].views += 1;
      return acc;
    }, {});

    // Top performing artists
    const artistPerformance = artworkViews.reduce((acc, event) => {
      const key = event.artistId;
      if (!acc[key]) {
        acc[key] = {
          artistId: event.artistId,
          artistName: event.artistName,
          views: 0,
          artworks: new Set()
        };
      }
      acc[key].views += 1;
      acc[key].artworks.add(event.artworkId);
      return acc;
    }, {});

    // Convert Set to count for each artist
    Object.values(artistPerformance).forEach((artist: any) => {
      artist.artworkCount = artist.artworks.size;
      delete artist.artworks;
    });

    return {
      topPerformingArtworks: Object.values(artworkPerformance)
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 10),
      topPerformingArtists: Object.values(artistPerformance)
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 10)
    };
  }
}

export default AnalyticsService; 