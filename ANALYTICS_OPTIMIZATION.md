# Analytics Optimization - Database Abuse Prevention

## Overview
This document outlines the optimizations implemented to prevent database abuse from excessive analytics tracking.

## Issues Identified

### 1. Excessive Database Writes
- **Problem**: Every user interaction created a new document in `analytics_events` collection
- **Impact**: High Firebase costs and potential rate limiting
- **Solution**: Implemented batching and queuing system

### 2. Redundant Tracking
- **Problem**: Multiple tracking calls for the same events
- **Impact**: Duplicate data and unnecessary database operations
- **Solution**: Added deduplication and rate limiting

### 3. Heavy Metadata Collection
- **Problem**: Each event included extensive metadata (userAgent, screen resolution, etc.)
- **Impact**: Large document sizes and increased storage costs
- **Solution**: Simplified metadata to essential data only

### 4. No Rate Limiting
- **Problem**: Users could spam events rapidly
- **Impact**: Database abuse and potential DoS
- **Solution**: Implemented configurable rate limiting per event type

## Optimizations Implemented

### 1. Event Batching
```typescript
// Events are queued and batched together
private eventQueue: Omit<AnalyticsEvent, 'id'>[] = [];
private batchSize: number = 10; // Configurable
private flushInterval: number = 30000; // 30 seconds
```

### 2. Rate Limiting
```typescript
// Rate limits per event type and user/session
RATE_LIMITS: {
  QR_SCAN: 5000, // 5 seconds
  ARTWORK_VIEW: 30000, // 30 seconds
  ARTWORK_INQUIRY: 60000, // 1 minute
  // ... etc
}
```

### 3. Simplified Metadata
```typescript
// Before: Heavy metadata
metadata: {
  userAgent: navigator.userAgent,
  referrer: document.referrer,
  pageUrl: window.location.href,
  screenResolution: `${screen.width}x${screen.height}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: navigator.language,
}

// After: Essential metadata only
metadata: {
  deviceType: this.getDeviceType(),
}
```

### 4. Event Deduplication
```typescript
// Prevent duplicate view tracking per session
const hasTrackedView = useRef<boolean>(false);
if (!isTrackingEnabled.current || hasTrackedView.current) return;
```

### 5. Configurable Sampling
```typescript
// For high-traffic scenarios
SAMPLING: {
  ENABLE_SAMPLING: false,
  SAMPLE_RATE: 0.1, // 10% of events
}
```

### 6. Minimum Thresholds
```typescript
// Only track significant interactions
THRESHOLDS: {
  MIN_TIME_SPENT: 30, // Only track if > 30 seconds
  MIN_SESSION_DURATION: 10,
}
```

## Configuration

### Analytics Config (`lib/analytics-config.ts`)
- **Rate Limits**: Configurable time windows for each event type
- **Batching**: Batch size and flush intervals
- **Features**: Toggle specific tracking features
- **Sampling**: Enable/disable sampling for high traffic

### Environment Variables
```bash
# Optional: Override default settings
NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE=0.1
NEXT_PUBLIC_ANALYTICS_BATCH_SIZE=20
NEXT_PUBLIC_ANALYTICS_FLUSH_INTERVAL=60000
```

## Usage Examples

### Basic Tracking (Optimized)
```typescript
const { trackArtworkView } = useAnalytics();

// Automatically rate-limited and batched
trackArtworkView(galleryId, galleryName, artworkId, artworkTitle, artistId, artistName);
```

### QR Code Tracking (Optional)
```typescript
// Disabled by default to prevent abuse
<QRCodeTracker
  galleryId={galleryId}
  galleryName={galleryName}
  artworkId={artworkId}
  artworkTitle={artworkTitle}
  artistId={artistId}
  artistName={artistName}
  autoTrack={false} // Must be explicitly enabled
/>
```

### Force Flush (Page Unload)
```typescript
const { forceFlush } = useAnalytics();

useEffect(() => {
  return () => {
    forceFlush(); // Ensure events are saved before page unload
  };
}, [forceFlush]);
```

## Performance Impact

### Before Optimization
- **Database Writes**: 1 write per event (immediate)
- **Document Size**: ~2-3KB per event
- **Rate Limiting**: None
- **Batching**: None

### After Optimization
- **Database Writes**: 1 write per 10 events (batched)
- **Document Size**: ~500B per event (simplified metadata)
- **Rate Limiting**: Configurable per event type
- **Batching**: Automatic with configurable intervals

### Estimated Cost Reduction
- **Write Operations**: ~90% reduction
- **Storage**: ~75% reduction
- **Network**: ~80% reduction

## Monitoring

### Queue Status
```typescript
// Check queue status in console
console.log(`Flushed ${eventsToProcess.length} analytics events`);
```

### Rate Limiting
```typescript
// Events are silently dropped when rate limited
// No console errors for rate-limited events
```

### Error Handling
```typescript
// Failed batches are re-queued
catch (error) {
  console.error('Error flushing analytics events:', error);
  this.eventQueue.unshift(...eventsToProcess); // Re-queue failed events
}
```

## Best Practices

### 1. Use Appropriate Rate Limits
- Short intervals for user-initiated actions (clicks, toggles)
- Longer intervals for passive tracking (views, time spent)

### 2. Enable Sampling for High Traffic
```typescript
SAMPLING: {
  ENABLE_SAMPLING: true,
  SAMPLE_RATE: 0.1, // 10% of events
}
```

### 3. Monitor Queue Size
- Set appropriate `MAX_QUEUE_SIZE` to prevent memory issues
- Monitor flush intervals for optimal performance

### 4. Test Rate Limiting
- Verify rate limits work as expected
- Adjust limits based on user behavior patterns

## Troubleshooting

### Events Not Being Tracked
1. Check if rate limiting is preventing tracking
2. Verify sampling settings
3. Check console for errors

### High Memory Usage
1. Reduce `MAX_QUEUE_SIZE`
2. Decrease `FLUSH_INTERVAL`
3. Enable sampling

### Database Still Getting Abused
1. Increase rate limit windows
2. Enable sampling
3. Review event tracking frequency in components

## Future Improvements

1. **Compression**: Compress event data before storage
2. **Aggregation**: Pre-aggregate common metrics
3. **Caching**: Cache frequently accessed analytics data
4. **Real-time Monitoring**: Dashboard for analytics performance
5. **Adaptive Rate Limiting**: Dynamic rate limits based on traffic 