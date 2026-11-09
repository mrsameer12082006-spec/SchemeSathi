import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for lightweight Hash-based routing without external router libraries.
 * Parses hash routes such as:
 *   /#/
 *   /#/chat
 *   /#/results
 *   /#/schemes
 *   /#/scheme/:id
 *   /#/how-it-works
 *   /#/about
 */
export function useRoute() {
  const getRouteInfo = useCallback(() => {
    let hash = window.location.hash || '#/';
    if (!hash.startsWith('#')) hash = '#' + hash;
    const cleanPath = hash.replace(/^#/, '') || '/';

    // Route matching
    if (cleanPath === '/' || cleanPath === '') {
      return { route: '/', path: '/', params: {} };
    }
    if (cleanPath === '/chat') {
      return { route: '/chat', path: '/chat', params: {} };
    }
    if (cleanPath === '/results') {
      return { route: '/results', path: '/results', params: {} };
    }
    if (cleanPath === '/schemes') {
      return { route: '/schemes', path: '/schemes', params: {} };
    }
    if (cleanPath === '/how-it-works') {
      return { route: '/how-it-works', path: '/how-it-works', params: {} };
    }
    if (cleanPath === '/about') {
      return { route: '/about', path: '/about', params: {} };
    }

    // Dynamic route: /scheme/:id
    const schemeMatch = cleanPath.match(/^\/scheme\/([^/?#]+)/);
    if (schemeMatch) {
      return {
        route: '/scheme/:id',
        path: cleanPath,
        params: { id: schemeMatch[1] }
      };
    }

    // Fallback unknown routes to Home
    return { route: '/', path: '/', params: {} };
  }, []);

  const [routeInfo, setRouteInfo] = useState(getRouteInfo);

  useEffect(() => {
    const handleHashChange = () => {
      setRouteInfo(getRouteInfo());
      // Each route change scrolls to top
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getRouteInfo]);

  const navigate = useCallback((toPath) => {
    const formatted = toPath.startsWith('#')
      ? toPath
      : `#${toPath.startsWith('/') ? toPath : '/' + toPath}`;

    if (window.location.hash === formatted) {
      window.scrollTo(0, 0);
    } else {
      window.location.hash = formatted;
    }
  }, []);

  return { ...routeInfo, navigate };
}

export default useRoute;
