import fs from 'fs';
import path from 'path';
import {
  Proverb,
  Category,
  SuggestionSubmission,
  CorrectionSubmission,
  SearchFilters,
  PaginatedResult,
  ContentStatus,
} from '@/types';
import { CATEGORIES } from './categories';
import { matchesSearch, normalizeMarathiText } from '@/lib/devanagari';
import rawProverbsData from './proverbs.json';

// In-memory singletons for fast performance
let proverbsCache: Proverb[] = rawProverbsData as Proverb[];
let suggestionsCache: SuggestionSubmission[] = [];
let correctionsCache: CorrectionSubmission[] = [];
let initialized = false;

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const CORRECTIONS_FILE = path.join(DATA_DIR, 'corrections.json');

function initStorage() {
  if (initialized) return;
  initialized = true;

  try {
    if (fs.existsSync(SUGGESTIONS_FILE)) {
      const data = fs.readFileSync(SUGGESTIONS_FILE, 'utf-8');
      suggestionsCache = JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load suggestions from disk:', err);
  }

  try {
    if (fs.existsSync(CORRECTIONS_FILE)) {
      const data = fs.readFileSync(CORRECTIONS_FILE, 'utf-8');
      correctionsCache = JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load corrections from disk:', err);
  }
}

function saveSuggestions() {
  try {
    fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestionsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save suggestions:', err);
  }
}

function saveCorrections() {
  try {
    fs.writeFileSync(CORRECTIONS_FILE, JSON.stringify(correctionsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save corrections:', err);
  }
}

// ---------------- Public Accessors ---------------- //

export function getAllProverbs(): Proverb[] {
  initStorage();
  return proverbsCache;
}

export function getPublishedProverbs(): Proverb[] {
  initStorage();
  return proverbsCache.filter((p) => p.status === 'published');
}

export function getProverbBySerial(serial: number): Proverb | null {
  initStorage();
  return proverbsCache.find((p) => p.serialNumber === serial) || null;
}

export function getCurationMetrics() {
  initStorage();
  const published = proverbsCache.filter((p) => p.status === 'published').length;
  const verified = proverbsCache.filter((p) => p.status === 'verified').length;
  const reviewed = proverbsCache.filter((p) => p.status === 'reviewed').length;
  const draft = proverbsCache.filter((p) => p.status === 'draft').length;
  const target = 1000;
  return {
    totalAllocated: proverbsCache.length,
    publishedCount: published,
    verifiedCount: verified,
    reviewedCount: reviewed,
    draftCount: draft,
    targetCount: target,
    remainingGap: target - published,
    completionPercentage: Number(((published / target) * 100).toFixed(1)),
  };
}

export function getProverbByIdOrSlug(idOrSlug: string): Proverb | null {
  initStorage();
  if (!idOrSlug) return null;

  const decoded = decodeURIComponent(idOrSlug).trim();

  // 1. Numeric serial check (Arabic e.g. "12" or Devanagari numerals e.g. "१२")
  const arabicStr = decoded.replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d).toString());
  const serialNum = parseInt(arabicStr, 10);
  if (!isNaN(serialNum) && String(serialNum) === arabicStr) {
    const bySerial = getProverbBySerial(serialNum);
    if (bySerial) return bySerial;
  }

  // 2. ID exact check
  const byId = proverbsCache.find((p) => p.id === decoded);
  if (byId) return byId;

  // 3. Slug exact check
  const bySlug = proverbsCache.find((p) => p.slug === decoded);
  if (bySlug) return bySlug;

  // 4. Normalized proverb match
  const norm = normalizeMarathiText(decoded);
  const byNorm = proverbsCache.find((p) => p.normalized === norm);
  if (byNorm) return byNorm;

  return null;
}

export function searchProverbs(filters: SearchFilters): PaginatedResult<Proverb> {
  initStorage();

  const {
    query = '',
    category,
    tag,
    sortBy = 'serial',
    sortOrder = 'asc',
    page = 1,
    pageSize = 24,
    status = 'published',
  } = filters;

  // Base status filter
  let filtered =
    status === 'all'
      ? [...proverbsCache]
      : proverbsCache.filter((p) => p.status === (status || 'published'));

  // Category filter
  if (category && category !== 'all') {
    const cleanCat = category.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.category.toLowerCase() === cleanCat ||
        CATEGORIES.some(
          (c) =>
            (c.slug === cleanCat || c.id === cleanCat) &&
            c.titleMarathi.toLowerCase() === p.category.toLowerCase()
        )
    );
  }

  // Tag filter
  if (tag) {
    const cleanTag = tag.toLowerCase().trim();
    filtered = filtered.filter((p) => p.tags.some((t) => t.toLowerCase() === cleanTag));
  }

  // Text search filter
  if (query && query.trim()) {
    filtered = filtered.filter((p) => matchesSearch(p, query));
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'serial') {
      return sortOrder === 'asc' ? a.serialNumber - b.serialNumber : b.serialNumber - a.serialNumber;
    }
    if (sortBy === 'alpha') {
      const cmp = a.proverb.localeCompare(b.proverb, 'mr');
      return sortOrder === 'asc' ? cmp : -cmp;
    }
    if (sortBy === 'recent') {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return a.serialNumber - b.serialNumber;
  });

  const total = filtered.length;
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.ceil(total / safePageSize) || 1;
  const startIndex = (safePage - 1) * safePageSize;
  const items = filtered.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    hasMore: safePage < totalPages,
  };
}

export function getRelatedProverbs(current: Proverb, limit = 4): Proverb[] {
  initStorage();
  const published = getPublishedProverbs().filter((p) => p.id !== current.id);

  // 1. Same category proverbs
  const sameCat = published.filter((p) => p.category === current.category);

  // 2. Score by overlapping tags
  const scored = sameCat.map((p) => {
    const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
    return { proverb: p, score: sharedTags };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored.length >= limit) {
    return scored.slice(0, limit).map((s) => s.proverb);
  }

  // If not enough, fill with other published proverbs from same category
  const result = scored.map((s) => s.proverb);
  for (const p of published) {
    if (result.length >= limit) break;
    if (!result.some((r) => r.id === p.id)) {
      result.push(p);
    }
  }

  return result.slice(0, limit);
}

/**
 * Deterministic Proverb of the Day
 * Calculated from the calendar date in Asia/Kolkata timezone.
 * Consistent across refreshes for everyone on the same calendar day.
 */
export function getDailyProverb(targetDate?: Date): { proverb: Proverb; dateString: string } {
  initStorage();
  const published = getPublishedProverbs();
  if (published.length === 0) {
    throw new Error('No published proverbs found');
  }

  const d = targetDate || new Date();
  // Get date in Asia/Kolkata timezone
  const kolkataDateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
  const [year, month, day] = kolkataDateStr.split('-').map(Number);

  // Deterministic hash based on Gregorian year, month, and day
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / (24 * 60 * 60 * 1000)
  );

  // Offset index using day of year + year salt
  const index = Math.abs((year * 365 + dayOfYear * 17) % published.length);
  return {
    proverb: published[index],
    dateString: kolkataDateStr,
  };
}

export function getCategoriesWithCounts(): (Category & { count: number })[] {
  initStorage();
  const published = getPublishedProverbs();

  return CATEGORIES.map((cat) => {
    const count = published.filter(
      (p) =>
        p.category.toLowerCase() === cat.titleMarathi.toLowerCase() ||
        p.category.toLowerCase() === cat.titleEnglish.toLowerCase()
    ).length;
    return {
      ...cat,
      count,
    };
  });
}

// ---------------- Community Submissions ---------------- //

export function submitSuggestion(
  data: Omit<SuggestionSubmission, 'id' | 'status' | 'createdAt'>
): SuggestionSubmission {
  initStorage();
  const newSubmission: SuggestionSubmission = {
    id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  suggestionsCache.unshift(newSubmission);
  saveSuggestions();
  return newSubmission;
}

export function getSuggestions(): SuggestionSubmission[] {
  initStorage();
  return suggestionsCache;
}

export function updateSuggestionStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminNotes?: string
): SuggestionSubmission | null {
  initStorage();
  const item = suggestionsCache.find((s) => s.id === id);
  if (!item) return null;

  item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  saveSuggestions();
  return item;
}

export function submitCorrection(
  data: Omit<CorrectionSubmission, 'id' | 'status' | 'createdAt'>
): CorrectionSubmission {
  initStorage();
  const newCorrection: CorrectionSubmission = {
    id: `cor-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  correctionsCache.unshift(newCorrection);
  saveCorrections();
  return newCorrection;
}

export function getCorrections(): CorrectionSubmission[] {
  initStorage();
  return correctionsCache;
}

export function updateCorrectionStatus(
  id: string,
  status: 'pending' | 'resolved' | 'dismissed',
  adminNotes?: string
): CorrectionSubmission | null {
  initStorage();
  const item = correctionsCache.find((c) => c.id === id);
  if (!item) return null;

  item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  saveCorrections();
  return item;
}

// ---------------- Admin CRUD Operations ---------------- //

export function createProverb(data: Omit<Proverb, 'id' | 'serialNumber' | 'createdAt' | 'updatedAt'>): Proverb {
  initStorage();
  const nextSerial = proverbsCache.length > 0
    ? Math.max(...proverbsCache.map((p) => p.serialNumber)) + 1
    : 1;

  const now = new Date().toISOString();
  const newProverb: Proverb = {
    ...data,
    id: `mhan-${nextSerial}`,
    serialNumber: nextSerial,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? now : undefined,
  };

  proverbsCache.push(newProverb);
  saveProverbsToDisk();
  return newProverb;
}

export function updateProverb(id: string, updates: Partial<Proverb>): Proverb | null {
  initStorage();
  const index = proverbsCache.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = proverbsCache[index];
  const now = new Date().toISOString();

  const updated: Proverb = {
    ...existing,
    ...updates,
    serialNumber: existing.serialNumber, // Strict non-negotiable: permanent serial cannot be changed
    id: existing.id,
    updatedAt: now,
    publishedAt:
      updates.status === 'published' && existing.status !== 'published'
        ? now
        : existing.publishedAt,
  };

  proverbsCache[index] = updated;
  saveProverbsToDisk();
  return updated;
}

function saveProverbsToDisk() {
  try {
    const jsonPath = path.join(DATA_DIR, 'proverbs.json');
    fs.writeFileSync(jsonPath, JSON.stringify(proverbsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save updated proverbs to disk:', err);
  }
}

export function getStats() {
  initStorage();
  const published = proverbsCache.filter((p) => p.status === 'published').length;
  const draft = proverbsCache.filter((p) => p.status === 'draft').length;
  const pendingReview = proverbsCache.filter((p) => p.status === 'pending_review').length;
  const pendingSuggestions = suggestionsCache.filter((s) => s.status === 'pending').length;
  const pendingCorrections = correctionsCache.filter((c) => c.status === 'pending').length;

  return {
    totalProverbs: proverbsCache.length,
    published,
    draft,
    pendingReview,
    pendingSuggestions,
    pendingCorrections,
    categoriesCount: CATEGORIES.length,
  };
}
