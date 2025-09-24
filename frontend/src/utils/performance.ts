// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

export const logComponentRender = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} rendered at ${new Date().toISOString()}`);
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload API endpoints that are likely to be used
  const criticalEndpoints = [
    '/api/health',
    '/api/products?limit=12&page=1'
  ];

  criticalEndpoints.forEach(endpoint => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `http://localhost:5000${endpoint}`;
    document.head.appendChild(link);
  });
};