export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/vite.svg',
      ...options,
    });
  }
};

export const notifyNewRelease = (movieTitle: string) => {
  sendNotification('New Movie Release!', {
    body: `${movieTitle} is now available. Check it out!`,
    tag: 'new-release',
  });
};

export const notifyRecommendation = (movieTitle: string) => {
  sendNotification('Movie Recommendation', {
    body: `We think you'll love ${movieTitle}. Give it a try!`,
    tag: 'recommendation',
  });
};

export const notifyWatchlistUpdate = (message: string) => {
  sendNotification('Watchlist Updated', {
    body: message,
    tag: 'watchlist',
  });
};
