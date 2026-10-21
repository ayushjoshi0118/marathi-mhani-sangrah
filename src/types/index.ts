export type ContentStatus = 'draft' | 'reviewed' | 'pending_review' | 'verified' | 'published' | 'archived';

export interface EditorialReview {
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  linguisticVerified: boolean;
  sourceVerified: boolean;
}

export interface Proverb {
  id: string;
  serialNumber: number; // Permanent serial number: 1, 2, ... 1000
  slug: string;
  proverb: string;
  normalized: string;
  meaningMarathi: string;
  meaningEnglish: string;
  exampleMarathi: string;
  exampleEnglish: string;
  context: string;
  englishEquivalent?: string | null;
  category: string;
  tags: string[];
  sourceNotes?: string;
  regionalNotes?: string;
  status: ContentStatus;
  editorialReview: EditorialReview;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  titleMarathi: string;
  titleEnglish: string;
  descriptionMarathi: string;
  descriptionEnglish: string;
  icon: string;
  color: string;
  proverbCount?: number;
}

export interface SuggestionSubmission {
  id: string;
  proverb: string;
  meaning?: string;
  meaningMarathi?: string;
  meaningEnglish?: string;
  englishMeaning?: string;
  example?: string;
  usageExample?: string;
  suggestedCategory?: string;
  contributorName?: string;
  contributorEmail?: string;
  source?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes?: string;
}

export interface CorrectionSubmission {
  id: string;
  proverbId: string;
  proverbSerialNumber?: number;
  proverbText: string;
  issueType?: 'spelling' | 'meaning' | 'usage' | 'other';
  correctionType?: 'spelling' | 'meaning' | 'example' | 'context' | 'other';
  description?: string;
  details?: string;
  suggestedCorrection?: string;
  reporterName?: string;
  reporterEmail?: string;
  contributorName?: string;
  contributorEmail?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  adminNotes?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  sortBy?: 'serial' | 'alpha' | 'recent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  status?: ContentStatus | 'all';
}
