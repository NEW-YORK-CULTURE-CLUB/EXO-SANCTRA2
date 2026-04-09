# Exhibit-IQ Reputation System

## Overview

The Exhibit-IQ reputation system implements a gamified IQ Score (0-150) that rewards users for positive engagement and provides subscription discounts based on their reputation level. This system encourages community participation and builds trust among galleries, artists, and collectors.

## Features

### 🏆 IQ Score System
- **Score Range**: 0-150 points
- **Real-time Calculation**: Based on user actions and engagement
- **Automatic Level Progression**: Users advance through levels as they earn points

### 🎯 Reputation Levels

| Level | Score Range | Name | Discount | Description |
|-------|-------------|------|----------|-------------|
| 0-30 | Newcomer | 0% | Just joined, minimal activity |
| 31-60 | Explorer | 5% | Some activity, building reputation |
| 61-90 | Contributor | 10% | Consistent engagement, growing trust |
| 91-120 | Established | 15% | Recognized member, trusted by community |
| 121-150 | Luminary | 20% | Top-tier reputation, community leader |

### 💰 Subscription Discounts
- **Newcomer**: Standard pricing (0% discount)
- **Explorer**: 5% discount on subscription fees
- **Contributor**: 10% discount on subscription fees
- **Established**: 15% discount on subscription fees
- **Luminary**: 20% discount on subscription fees

## Technical Implementation

### Database Collections

#### ReputationScores
```typescript
interface ReputationScore {
  id: string;                    // `${userId}_${userType}`
  userId: string;                // User ID
  userType: 'gallery' | 'artist' | 'collector';
  currentScore: number;          // Current IQ score (0-150)
  level: ReputationLevel;        // Current reputation level
  totalActions: number;          // Total actions performed
  positiveActions: number;       // Positive actions count
  negativeActions: number;       // Negative actions count
  lastCalculated: Timestamp;     // Last calculation timestamp
  createdAt: Timestamp;
  updatedAt: Timestamp;
  actions: {                     // Detailed action breakdown
    artworkUploaded: number;
    artworkSold: number;
    positiveReviews: number;
    // ... other action types
  };
}
```

#### ReputationActions
```typescript
interface ReputationAction {
  id: string;                    // `${userId}_${actionType}_${timestamp}`
  userId: string;                // User ID
  userType: 'gallery' | 'artist' | 'collector';
  actionType: string;            // Type of action performed
  actionValue: number;           // Points earned/lost
  description: string;           // Human-readable description
  relatedItemId?: string;        // Related artwork/transaction ID
  metadata?: any;                // Additional context
  createdAt: Timestamp;
}
```

### Point System

#### Gallery Actions
- **Artwork Uploaded**: +2 points
- **Artwork Sold**: +5 points
- **Positive Review**: +3 points
- **Negative Review**: -2 points
- **Community Engagement**: +1 point
- **Successful Transaction**: +4 points
- **Failed Transaction**: -3 points
- **Gallery Exhibition**: +3 points
- **Artist Collaboration**: +2 points
- **Time on Platform**: +0.1 points/day

#### Artist Actions
- **Artwork Uploaded**: +3 points
- **Artwork Sold**: +4 points
- **Positive Review**: +4 points
- **Negative Review**: -3 points
- **Community Engagement**: +2 points
- **Successful Transaction**: +3 points
- **Failed Transaction**: -2 points
- **Gallery Exhibition**: +5 points
- **Artist Collaboration**: +3 points
- **Time on Platform**: +0.1 points/day

#### Collector Actions
- **Artwork Purchased**: +4 points
- **Positive Review**: +2 points
- **Negative Review**: -2 points
- **Community Engagement**: +1 point
- **Successful Transaction**: +3 points
- **Failed Transaction**: -3 points
- **Collector Purchase**: +2 points
- **Time on Platform**: +0.05 points/day

## Usage

### Basic Reputation Display

```tsx
import { ReputationBadge } from '@/components/reputation-score';

// Compact badge
<ReputationBadge userId="user123" userType="gallery" />

// Full display
<ReputationDisplay userId="user123" userType="gallery" />
```

### Recording Actions

```tsx
import { ReputationService } from '@/lib/reputation-service';

// Record a positive action
await ReputationService.recordArtworkUpload(userId, 'gallery');

// Record a custom action
await ReputationService.recordAction({
  userId: 'user123',
  userType: 'gallery',
  actionType: 'custom_action',
  actionValue: 5,
  description: 'Custom positive action'
});
```

### Getting Reputation Data

```tsx
// Get user's reputation score
const score = await ReputationService.getReputationScore(userId, 'gallery');

// Get top users
const topGalleries = await ReputationService.getTopUsers('gallery', 10);

// Get system statistics
const stats = await ReputationService.getReputationStats();
```

## Components

### ReputationScoreDisplay
Main component for displaying reputation information with configurable detail level.

**Props:**
- `userId`: User ID
- `userType`: User type ('gallery', 'artist', 'collector')
- `showDetails`: Show detailed breakdown (default: false)
- `compact`: Show compact version (default: false)

### ReputationBadge
Compact badge showing score and level.

### ReputationDisplay
Full reputation display with detailed breakdown.

## Integration Points

### Automatic Action Recording
The system automatically records reputation actions for:
- Artwork uploads
- Sales transactions
- Reviews and ratings
- Community engagement
- Time on platform

### Real-time Updates
Reputation scores are updated in real-time when actions are recorded, ensuring immediate feedback to users.

### Analytics Integration
Reputation data integrates with the existing analytics system to provide insights into user behavior and community health.

## Future Enhancements

### Planned Features
- **Achievement System**: Badges and milestones for specific accomplishments
- **Seasonal Events**: Time-limited reputation boost events
- **Community Challenges**: Collaborative goals with reputation rewards
- **Advanced Analytics**: Detailed reputation trend analysis
- **API Integration**: External service reputation import/export

### Customization Options
- **Configurable Weights**: Adjustable point values for different actions
- **Custom Action Types**: Gallery-specific reputation actions
- **Regional Variations**: Different point systems for different markets
- **Tier-based Rewards**: Additional benefits beyond subscription discounts

## Monitoring and Maintenance

### Health Checks
- Monitor reputation calculation accuracy
- Track action recording success rates
- Validate point distribution fairness

### Performance Optimization
- Cache frequently accessed reputation scores
- Batch reputation updates for high-volume actions
- Optimize database queries for leaderboards

### Data Integrity
- Regular backup of reputation data
- Validation of reputation calculations
- Audit trail for manual reputation adjustments

## Security Considerations

### Access Control
- Reputation scores are publicly visible but action details are private
- Only authenticated users can record actions
- Rate limiting on action recording to prevent abuse

### Fraud Prevention
- Validation of action authenticity
- Monitoring for suspicious activity patterns
- Appeal process for incorrect reputation changes

## Support and Documentation

### User Guides
- How to earn reputation points
- Understanding reputation levels
- Maximizing subscription discounts

### Developer Resources
- API documentation
- Integration examples
- Troubleshooting guides

### Community Support
- FAQ and knowledge base
- User forums and discussions
- Direct support channels

---

For technical questions or feature requests, please contact the development team or create an issue in the project repository.
