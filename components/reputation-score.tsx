'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, Users, Award } from 'lucide-react';
import { ReputationService, REPUTATION_LEVELS, ReputationScore } from '@/lib/reputation-service';

interface ReputationScoreProps {
  userId: string;
  userType: 'gallery' | 'artist' | 'collector';
  showDetails?: boolean;
  compact?: boolean;
}

export function ReputationScoreDisplay({ userId, userType, showDetails = false, compact = false }: ReputationScoreProps) {
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReputation = async () => {
      try {
        setLoading(true);
        const score = await ReputationService.getReputationScore(userId, userType);
        setReputation(score);
      } catch (error) {
        console.error('Error loading reputation score:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReputation();
  }, [userId, userType]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    );
  }

  if (!reputation) {
    return null;
  }

  const levelInfo = REPUTATION_LEVELS[reputation.level];
  const progressToNextLevel = ((reputation.currentScore - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            reputation.level === 'LUMINARY' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
            reputation.level === 'ESTABLISHED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
            reputation.level === 'CONTRIBUTOR' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
            reputation.level === 'EXPLORER' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
          }`}
        >
          {reputation.currentScore} IQ
        </Badge>
        <span className="text-xs text-muted-foreground">{levelInfo.name}</span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          IQ Score: {reputation.currentScore}
          <Badge 
            variant="secondary" 
            className={`ml-2 ${
              reputation.level === 'LUMINARY' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
              reputation.level === 'ESTABLISHED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
              reputation.level === 'CONTRIBUTOR' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
              reputation.level === 'EXPLORER' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
            }`}
          >
            {levelInfo.name}
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {levelInfo.discount > 0 ? `${levelInfo.discount}% subscription discount` : 'Standard pricing'}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to {reputation.level === 'LUMINARY' ? 'Max Level' : 'Next Level'}</span>
            <span>{reputation.currentScore - levelInfo.min} / {levelInfo.max - levelInfo.min} points</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{reputation.totalActions}</div>
            <div className="text-xs text-muted-foreground">Total Actions</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{reputation.positiveActions}</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Action Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Activity Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(reputation.actions).map(([key, value]) => {
                  if (value > 0) {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Level Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Award className="w-4 h-4" />
                Level Benefits
              </h4>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Subscription discount: {levelInfo.discount}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Community recognition: {levelInfo.name}</span>
                </div>
                {reputation.level === 'LUMINARY' && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>Premium features unlocked</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Compact reputation badge component
export function ReputationBadge({ userId, userType }: { userId: string; userType: 'gallery' | 'artist' | 'collector' }) {
  return <ReputationScoreDisplay userId={userId} userType={userType} compact={true} />;
}

// Full reputation display component
export function ReputationDisplay({ userId, userType }: { userId: string; userType: 'gallery' | 'artist' | 'collector' }) {
  return <ReputationScoreDisplay userId={userId} userType={userType} showDetails={true} />;
}
