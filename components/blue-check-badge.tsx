import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface BlueCheckBadgeProps {
  verified: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const BlueCheckBadge: React.FC<BlueCheckBadgeProps> = ({
  verified,
  verificationDate,
  verificationMethod,
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  const getStatusInfo = () => {
    if (verified) {
      return {
        icon: CheckCircle,
        text: 'Blue Check Verified',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
        description: 'Document verified for authenticity'
      };
    } else {
      return {
        icon: XCircle,
        text: 'Verification Failed',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        description: 'Document verification unsuccessful'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`flex items-center gap-1 ${statusInfo.color}`}>
        <IconComponent className={iconSizes[size]} />
        <span className={`font-medium ${sizeClasses[size]}`}>
          {statusInfo.text}
        </span>
      </div>
      
      {showDetails && verificationDate && (
        <div className={`text-xs text-muted-foreground ${sizeClasses[size]}`}>
          {new Date(verificationDate).toLocaleDateString()}
        </div>
      )}
      
      {showDetails && verificationMethod && (
        <div className="hidden md:block">
          <div className="text-xs text-muted-foreground">
            {verificationMethod}
          </div>
        </div>
      )}
    </div>
  );
};

export const BlueCheckBadgeWithTooltip: React.FC<BlueCheckBadgeProps & {
  tooltipContent?: string;
}> = ({
  verified,
  verificationDate,
  verificationMethod,
  size = 'md',
  showDetails = false,
  className = '',
  tooltipContent
}) => {
  const getStatusInfo = () => {
    if (verified) {
      return {
        icon: CheckCircle,
        text: 'Blue Check Verified',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
        description: 'Document verified for authenticity'
      };
    } else {
      return {
        icon: XCircle,
        text: 'Verification Failed',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        description: 'Document verification unsuccessful'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 cursor-help ${className}`}
      title={tooltipContent || statusInfo.description}
    >
      <div className={`flex items-center gap-1 ${statusInfo.color}`}>
        <IconComponent className={iconSizes[size]} />
        <span className={`font-medium ${sizeClasses[size]}`}>
          {statusInfo.text}
        </span>
      </div>
      
      {showDetails && verificationDate && (
        <div className={`text-xs text-muted-foreground ${sizeClasses[size]}`}>
          {new Date(verificationDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}; 