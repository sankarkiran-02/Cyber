export function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  
  // Convert to minutes, hours, days
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Detailed time ranges
  if (days > 0) {
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    
    // For weeks, use a more readable format
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1w ago' : `${weeks}w ago`;
  }
  
  if (hours > 0) {
    return hours === 1 ? '1h ago' : `${hours}h ago`;
  }
  
  if (minutes > 0) {
    return minutes === 1 ? '1m ago' : `${minutes}m ago`;
  }
  
  return 'Just now';
}

// Optional: More detailed time formatting
export function getDetailedTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    // More than a month
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  if (days > 0) {
    return days === 1 ? 'yesterday' : `${days} days ago`;
  }

  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }

  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} min ago`;
  }

  return 'Now';
}