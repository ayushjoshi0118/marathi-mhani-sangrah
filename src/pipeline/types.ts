/**
 * Content Curation & Verification Pipeline Types
 * 
 * Formal data types for the Marathi Proverbs curation lifecycle,
 * validation stages, provenance tracking, and editorial signoffs.
 */

export type CurationState = 
  | 'draft'               // Ingested candidate, awaiting automated validation
  | 'reviewed'            // Passed automated checks (Devanagari, structure, deduplication)
  | 'verified'            // Passed editorial review for linguistic authenticity & meaning
  | 'published'           // Approved and released to public index
  | 'rejected'            // Rejected (synthetic, invalid, duplicate, or unverified)
  | 'variant_linked';     // Linked as a dialect/regional variant of a canonical proverb

export type ProvenanceType =
  | 'oral_folklore'               // Traditional folk wisdom passed down orally
  | 'lexicography_public_domain'  // Documented in historical dictionaries (e.g., Molesworth 1857)
  | 'reference_corpus'           // Recognized in regional linguistic references (e.g., Date & Karve)
  | 'pedagogical_canon';          // Standard school & collegiate Marathi grammar / literature canon

export interface ProvenanceRecord {
  type: ProvenanceType;
  sourceDescription: string;
  historicalEra?: string;
  regionalVariantOf?: number;    // Serial number of canonical proverb if this is a variant
  notes?: string;
  uncertaintyAcknowledged: boolean; // Explicitly true if exact origin/date is oral/unrecorded
}

export interface AutomatedValidationReport {
  passed: boolean;
  devanagariValid: boolean;
  orthographyClean: boolean;
  fieldsComplete: boolean;
  duplicateScore: number;         // 0 to 1 (0 = completely unique, 1 = identical)
  duplicateOfSerial?: number;
  identifiedVariantOf?: number;
  errors: string[];
  warnings: string[];
}

export interface EditorialReviewRecord {
  reviewerRole: string;
  reviewedDate: string;           // ISO date
  linguisticAuthenticityConfirmed: boolean;
  meaningOriginalAndClear: boolean;
  exampleContextRealistic: boolean;
  isTraditionalProverb: boolean;  // Must be true — rejects synthetic combinations
  editorialNotes?: string;
}

export interface CuratedProverbEntry {
  serialNumber: number;           // Immutable integer 1-1000
  id: string;                     // e.g. "mhan-1"
  slug: string;                   // URL safe slug
  proverb: string;                // Canonical Devanagari text
  normalized: string;             // Punctuation-stripped normalized form
  meaningMarathi: string;         // Original, clear Marathi explanation
  meaningEnglish: string;         // Idiomatic English meaning
  exampleMarathi: string;         // Realistic Marathi usage sentence
  exampleEnglish: string;         // English translation of usage
  context: string;                // Sociocultural context of usage
  englishEquivalent?: string;     // Comparable English proverb/idiom
  category: string;               // One of the 16 canonical categories
  tags: string[];                 // 2-5 thematic tags
  provenance: ProvenanceRecord;   // Provenance and lineage
  status: CurationState;          // draft | reviewed | verified | published
  automatedValidation?: AutomatedValidationReport;
  editorialReview: EditorialReviewRecord;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PipelineSummary {
  totalAllocatedSlots: number;
  publishedCount: number;
  verifiedCount: number;
  reviewedCount: number;
  draftCount: number;
  rejectedCount: number;
  remainingGapToTarget: number;
  targetCount: number;
  batchImports: {
    batchId: string;
    description: string;
    importedCount: number;
    timestamp: string;
  }[];
}
