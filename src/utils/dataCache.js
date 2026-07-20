// In-memory cache for API responses to prevent redundant requests and spinners during page navigation
import { generateSlug } from "./slugify";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — auto-refresh after 5 min

let cache = {
  featuredPackages: null,
  featuredPackagesAt: null,
  allPackages: null,
  allPackagesAt: null,
  destinations: null,
  destinationsAt: null,
  siteSettings: null,
  siteSettingsAt: null,
  individualPackages: new Map(), // idOrSlug -> { data, timestamp }
};

const isExpired = (timestamp) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > CACHE_TTL_MS;
};

export const getCachedFeaturedPackages = () => {
  if (isExpired(cache.featuredPackagesAt)) return null;
  return cache.featuredPackages;
};
export const setCachedFeaturedPackages = (data) => {
  cache.featuredPackages = data;
  cache.featuredPackagesAt = Date.now();
};

// Aliases for backward compatibility
export const getCachedPackages = getCachedFeaturedPackages;
export const setCachedPackages = setCachedFeaturedPackages;

export const getCachedAllPackages = () => {
  if (isExpired(cache.allPackagesAt)) return null;
  return cache.allPackages;
};
export const setCachedAllPackages = (data) => {
  cache.allPackages = data;
  cache.allPackagesAt = Date.now();
};

export const getCachedDestinations = () => {
  if (isExpired(cache.destinationsAt)) return null;
  return cache.destinations;
};
export const setCachedDestinations = (data) => {
  cache.destinations = data;
  cache.destinationsAt = Date.now();
};

export const getCachedPackageByIdOrSlug = (idOrSlug) => {
  if (!idOrSlug) return null;
  const key = idOrSlug.toString().toLowerCase();

  if (cache.individualPackages.has(key)) {
    const entry = cache.individualPackages.get(key);
    if (!isExpired(entry.timestamp)) return entry.data;
    cache.individualPackages.delete(key);
  }

  const all = cache.allPackages || [];
  const featured = cache.featuredPackages || [];
  const list = [...all, ...featured];

  // Try numeric ID
  const numId = parseInt(idOrSlug);
  if (!isNaN(numId)) {
    const pkg = list.find(p => p.id === numId);
    if (pkg) return pkg;
  }

  // Try slug matching
  const slug = key.replace(/-/g, " ");
  const pkg = list.find(p => p.name.toLowerCase() === slug);
  if (pkg) return pkg;

  return null;
};

export const setCachedPackage = (idOrSlug, data) => {
  if (!idOrSlug || !data) return;
  const entry = { data, timestamp: Date.now() };
  const key = idOrSlug.toString().toLowerCase();
  cache.individualPackages.set(key, entry);
  if (data.id) {
    cache.individualPackages.set(data.id.toString().toLowerCase(), entry);
  }
  if (data.name) {
    const nameSlug = generateSlug(data.name);
    cache.individualPackages.set(nameSlug, entry);
  }
};

export const getCachedSettings = () => {
  if (isExpired(cache.siteSettingsAt)) return null;
  return cache.siteSettings;
};
export const setCachedSettings = (data) => {
  cache.siteSettings = data;
  cache.siteSettingsAt = Date.now();
};

export const clearCache = () => {
  cache.featuredPackages = null;
  cache.featuredPackagesAt = null;
  cache.allPackages = null;
  cache.allPackagesAt = null;
  cache.destinations = null;
  cache.destinationsAt = null;
  cache.siteSettings = null;
  cache.siteSettingsAt = null;
  cache.individualPackages.clear();
};

