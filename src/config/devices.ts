export const devices = {
  iPhone: {
    name: 'iPhone 12',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewport: {
      width: 375,
      height: 812,
    },
    isMobile: true,
    hasTouch: true,
    isLandscape: false,
  },
  iPad: {
    name: 'iPad Pro',
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    viewport: {
      width: 1024,
      height: 1366,
    },
    isMobile: true,
    hasTouch: true,
    isLandscape: false,
  },
  GalaxyS20: {
    name: 'Galaxy S20',
    userAgent:
      'Mozilla/5.0 (Linux; Android 10; SM-G980F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36',
    viewport: {
      width: 360,
      height: 800,
    },
    isMobile: true,
    hasTouch: true,
    isLandscape: false,
  },
  Desktop: {
    name: 'Desktop Chrome',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: {
      width: 1280,
      height: 720,
    },
    isMobile: false,
    hasTouch: false,
    isLandscape: true,
  },
};
