import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Reputation score levels and their descriptions
export const REPUTATION_LEVELS = {
  NEWCOMER: { min: 0, max: 30, name: 'Newcomer', discount: 0 },
  EXPLORER: { min: 31, max: 60, name: 'Explorer', discount: 5 },
  CONTRIBUTOR: { min: 61, max: 90, name: 'Contributor', discount: 10 },
  ESTABLISHED: { min: 91, max: 120, name: 'Established', discount: 15 },
  LUMINARY: { min: 121, max: 150, name: 'Luminary', discount: 20 }
} as const;

export type ReputationLevel = keyof typeof REPUTATION_LEVELS;

// Reputation score interface
export interface ReputationScore {
  id: string;
  userId: string;
  userType: 'gallery' | 'artist' | 'collector';
  currentScore: number;
  level: ReputationLevel;
  totalActions: number;
  positiveActions: number;
  negativeActions: number;
  lastCalculated: any;
  createdAt: any;
  updatedAt: any;
  
  // Action breakdown
  actions: {
    artworkUploaded: number;
    artworkSold: number;
    artworkPurchased: number;
    positiveReviews: number;
    negativeReviews: number;
    communityEngagement: number;
    successfulTransactions: number;
    failedTransactions: number;
    galleryExhibitions: number;
    artistCollaborations: number;
    collectorPurchases: number;
    timeOnPlatform: number; // in days
  };
}

// Action types that affect reputation
export interface ReputationAction {
  id: string;
  userId: string;
  userType: 'gallery' | 'artist' | 'collector';
  actionType: string;
  actionValue: number; // Positive or negative points
  description: string;
  relatedItemId?: string; // ID of related artwork, transaction, etc.
  metadata?: any; // Additional context
  createdAt: any;
}

// Reputation calculation weights
const REPUTATION_WEIGHTS = {
  // Gallery weights
  gallery: {
    artworkUploaded: 2,
    artworkSold: 5,
    positiveReviews: 3,
    negativeReviews: -2,
    communityEngagement: 1,
    successfulTransactions: 4,
    failedTransactions: -3,
    galleryExhibitions: 3,
    artistCollaborations: 2,
    timeOnPlatform: 0.1 // 0.1 points per day
  },
  
  // Artist weights
  artist: {
    artworkUploaded: 3,
    artworkSold: 4,
    positiveReviews: 4,
    negativeReviews: -3,
    communityEngagement: 2,
    successfulTransactions: 3,
    failedTransactions: -2,
    galleryExhibitions: 5,
    artistCollaborations: 3,
    timeOnPlatform: 0.1
  },
  
  // Collector weights
  collector: {
    artworkPurchased: 4,
    positiveReviews: 2,
    negativeReviews: -2,
    communityEngagement: 1,
    successfulTransactions: 3,
    failedTransactions: -3,
    collectorPurchases: 2,
    timeOnPlatform: 0.05
  }
};

export class ReputationService {
  private static COLLECTION_NAME = 'ReputationScores';
  private static ACTIONS_COLLECTION = 'ReputationActions';

  // Get reputation score for a user
  static async getReputationScore(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<ReputationScore | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, `${userId}_${userType}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ReputationScore;
      }
      
      // Create initial reputation score if it doesn't exist
      return await this.initializeReputationScore(userId, userType);
    } catch (error) {
      console.error('Error getting reputation score:', error);
      return null;
    }
  }

  // Initialize a new reputation score
  static async initializeReputationScore(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<ReputationScore> {
    const initialScore: ReputationScore = {
      id: `${userId}_${userType}`,
      userId,
      userType,
      currentScore: 0,
      level: 'NEWCOMER',
      totalActions: 0,
      positiveActions: 0,
      negativeActions: 0,
      lastCalculated: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      actions: {
        artworkUploaded: 0,
        artworkSold: 0,
        artworkPurchased: 0,
        positiveReviews: 0,
        negativeReviews: 0,
        communityEngagement: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        galleryExhibitions: 0,
        artistCollaborations: 0,
        collectorPurchases: 0,
        timeOnPlatform: 0
      }
    };

    try {
      await setDoc(doc(db, this.COLLECTION_NAME, initialScore.id), initialScore);
      return initialScore;
    } catch (error) {
      console.error('Error initializing reputation score:', error);
      throw error;
    }
  }

  // Record a reputation action
  static async recordAction(action: Omit<ReputationAction, 'id' | 'createdAt'>): Promise<void> {
    try {
      const actionDoc: ReputationAction = {
        ...action,
        id: `${action.userId}_${action.actionType}_${Date.now()}`,
        createdAt: serverTimestamp()
      };

      // Save the action
      await setDoc(doc(db, this.ACTIONS_COLLECTION, actionDoc.id), actionDoc);

      // Update reputation score
      await this.updateReputationScore(action.userId, action.userType);
    } catch (error) {
      console.error('Error recording reputation action:', error);
      throw error;
    }
  }

  // Update reputation score based on actions
  static async updateReputationScore(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<void> {
    try {
      // Get all actions for this user
      const actionsRef = collection(db, this.ACTIONS_COLLECTION);
      const q = query(actionsRef, where('userId', '==', userId), where('userType', '==', userType));
      const actionsSnapshot = await getDocs(q);
      
      const actions = actionsSnapshot.docs.map(doc => doc.data() as ReputationAction);
      
      // Calculate new score
      const newScore = this.calculateReputationScore(actions, userType);
      
      // Update reputation score document
      const scoreRef = doc(db, this.COLLECTION_NAME, `${userId}_${userType}`);
      await updateDoc(scoreRef, {
        currentScore: newScore.score,
        level: newScore.level,
        totalActions: newScore.totalActions,
        positiveActions: newScore.positiveActions,
        negativeActions: newScore.negativeActions,
        actions: newScore.actions,
        lastCalculated: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating reputation score:', error);
      throw error;
    }
  }

  // Calculate reputation score from actions
  private static calculateReputationScore(actions: ReputationAction[], userType: 'gallery' | 'artist' | 'collector'): {
    score: number;
    level: ReputationLevel;
    totalActions: number;
    positiveActions: number;
    negativeActions: number;
    actions: ReputationScore['actions'];
  } {
    const weights = REPUTATION_WEIGHTS[userType];
    let totalScore = 0;
    let positiveActions = 0;
    let negativeActions = 0;
    
    // Initialize action counts
    const actionCounts: ReputationScore['actions'] = {
      artworkUploaded: 0,
      artworkSold: 0,
      artworkPurchased: 0,
      positiveReviews: 0,
      negativeReviews: 0,
      communityEngagement: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      galleryExhibitions: 0,
      artistCollaborations: 0,
      collectorPurchases: 0,
      timeOnPlatform: 0
    };

    // Process each action
    actions.forEach(action => {
      const weight = weights[action.actionType as keyof typeof weights] || 0;
      const points = weight * action.actionValue;
      
      totalScore += points;
      
      if (points > 0) {
        positiveActions++;
      } else if (points < 0) {
        negativeActions++;
      }

      // Count specific actions
      if (action.actionType in actionCounts) {
        actionCounts[action.actionType as keyof typeof actionCounts]++;
      }
    });

    // Calculate time on platform (if we have creation date)
    if (actions.length > 0) {
      const oldestAction = actions.reduce((oldest, current) => 
        current.createdAt < oldest.createdAt ? current : oldest
      );
      const daysOnPlatform = Math.floor((Date.now() - oldestAction.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24));
      actionCounts.timeOnPlatform = daysOnPlatform;
      totalScore += weights.timeOnPlatform * daysOnPlatform;
    }

    // Ensure score is within bounds
    totalScore = Math.max(0, Math.min(150, totalScore));

    // Determine level
    let level: ReputationLevel = 'NEWCOMER';
    for (const [levelKey, levelData] of Object.entries(REPUTATION_LEVELS)) {
      if (totalScore >= levelData.min && totalScore <= levelData.max) {
        level = levelKey as ReputationLevel;
        break;
      }
    }

    return {
      score: totalScore,
      level,
      totalActions: actions.length,
      positiveActions,
      negativeActions,
      actions: actionCounts
    };
  }

  // Get reputation level info
  static getReputationLevelInfo(score: number): typeof REPUTATION_LEVELS[keyof typeof REPUTATION_LEVELS] {
    for (const levelData of Object.values(REPUTATION_LEVELS)) {
      if (score >= levelData.min && score <= levelData.max) {
        return levelData;
      }
    }
    return REPUTATION_LEVELS.NEWCOMER;
  }

  // Get top users by reputation
  static async getTopUsers(userType: 'gallery' | 'artist' | 'collector', limit: number = 10): Promise<ReputationScore[]> {
    try {
      const scoresRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        scoresRef,
        where('userType', '==', userType),
        orderBy('currentScore', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ReputationScore);
    } catch (error) {
      console.error('Error getting top users:', error);
      return [];
    }
  }

  // Get reputation statistics
  static async getReputationStats(): Promise<{
    totalUsers: number;
    averageScore: number;
    levelDistribution: Record<ReputationLevel, number>;
    topScores: ReputationScore[];
  }> {
    try {
      const scoresRef = collection(db, this.COLLECTION_NAME);
      const snapshot = await getDocs(scoresRef);
      
      const scores = snapshot.docs.map(doc => doc.data() as ReputationScore);
      const totalUsers = scores.length;
      const averageScore = totalUsers > 0 ? scores.reduce((sum, score) => sum + score.currentScore, 0) / totalUsers : 0;
      
      const levelDistribution: Record<ReputationLevel, number> = {
        NEWCOMER: 0,
        EXPLORER: 0,
        CONTRIBUTOR: 0,
        ESTABLISHED: 0,
        LUMINARY: 0
      };
      
      scores.forEach(score => {
        levelDistribution[score.level]++;
      });
      
      const topScores = scores
        .sort((a, b) => b.currentScore - a.currentScore)
        .slice(0, 10);
      
      return {
        totalUsers,
        averageScore,
        levelDistribution,
        topScores
      };
    } catch (error) {
      console.error('Error getting reputation stats:', error);
      return {
        totalUsers: 0,
        averageScore: 0,
        levelDistribution: {
          NEWCOMER: 0,
          EXPLORER: 0,
          CONTRIBUTOR: 0,
          ESTABLISHED: 0,
          LUMINARY: 0
        },
        topScores: []
      };
    }
  }

  // Helper method to record common actions
  static async recordArtworkUpload(userId: string, userType: 'gallery' | 'artist'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'artworkUploaded',
      actionValue: 1,
      description: 'Uploaded new artwork'
    });
  }

  static async recordArtworkSale(userId: string, userType: 'gallery' | 'artist'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'artworkSold',
      actionValue: 1,
      description: 'Sold artwork'
    });
  }

  static async recordPositiveReview(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'positiveReviews',
      actionValue: 1,
      description: 'Received positive review'
    });
  }

  static async recordNegativeReview(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'negativeReviews',
      actionValue: 1,
      description: 'Received negative review'
    });
  }

  static async recordSuccessfulTransaction(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'successfulTransactions',
      actionValue: 1,
      description: 'Completed successful transaction'
    });
  }

  static async recordFailedTransaction(userId: string, userType: 'gallery' | 'artist' | 'collector'): Promise<void> {
    await this.recordAction({
      userId,
      userType,
      actionType: 'failedTransactions',
      actionValue: 1,
      description: 'Transaction failed'
    });
  }
}
