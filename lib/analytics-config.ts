// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Rate limiting settings
  RATE_LIMITS: {
    QR_SCAN: 5000, // 5 seconds between QR scans per artwork
    ARTWORK_VIEW: 30000, // 30 seconds between views per artwork per session
    ARTWORK_INQUIRY: 60000, // 1 minute between inquiries per artwork per user
    GALLERY_VIEW: 30000, // 30 seconds between gallery views per session
    ARTIST_VIEW: 30000, // 30 seconds between artist views per session
    MARKETPLACE_VIEW: 30000, // 30 seconds between marketplace views per session
    DIGITAL_FLOOR_VIEW: 30000, // 30 seconds between digital floor views per session
    FAVORITE_TOGGLE: 10000, // 10 seconds between favorite toggles per artwork per user
    SHARE_ARTWORK: 30000, // 30 seconds between shares per artwork per user
    IMAGE_ZOOM: 10000, // 10 seconds between image zooms per artwork per session
    VIDEO_PLAY: 15000, // 15 seconds between video plays per artwork per session
    TIME_SPENT: 60000, // 1 minute between time spent tracking per artwork per session
  },

  // Batching settings
  BATCHING: {
    BATCH_SIZE: 10, // Number of events to batch together
    FLUSH_INTERVAL: 30000, // 30 seconds between automatic flushes
    MAX_QUEUE_SIZE: 100, // Maximum number of events in queue before forcing flush
  },

  // Minimum thresholds for tracking
  THRESHOLDS: {
    MIN_TIME_SPENT: 30, // Only track time spent if > 30 seconds
    MIN_SESSION_DURATION: 10, // Minimum session duration to track
  },

  // Feature toggles
  FEATURES: {
    ENABLE_QR_AUTO_TRACKING: false, // Disable automatic QR tracking by default
    ENABLE_DETAILED_METADATA: false, // Disable detailed metadata collection
    ENABLE_REAL_TIME_TRACKING: true, // Enable real-time tracking
  },

  // Sampling settings (for high-traffic scenarios)
  SAMPLING: {
    ENABLE_SAMPLING: false, // Enable sampling for high-traffic scenarios
    SAMPLE_RATE: 0.1, // 10% of events (0.1 = 10%)
  }
};

// Helper function to check if tracking should be enabled based on sampling
export const shouldTrackEvent = (eventType: string): boolean => {
  if (!ANALYTICS_CONFIG.SAMPLING.ENABLE_SAMPLING) {
    return true;
  }

  // Simple hash-based sampling
  const hash = eventType.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash) % 100 < (ANALYTICS_CONFIG.SAMPLING.SAMPLE_RATE * 100);
};

// Helper function to get rate limit for event type
export const getRateLimit = (eventType: string): number => {
  const eventKey = eventType.toUpperCase().replace(/[^A-Z_]/g, '');
  return ANALYTICS_CONFIG.RATE_LIMITS[eventKey as keyof typeof ANALYTICS_CONFIG.RATE_LIMITS] || 5000;
}; 