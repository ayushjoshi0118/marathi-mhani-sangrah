/**
 * Content Lifecycle State Machine
 * 
 * Enforces valid state transitions and prevents unverified or synthetic
 * proverbs from becoming publicly published.
 */

import { CurationState } from './types';

export const ALLOWED_STATE_TRANSITIONS: Record<CurationState, CurationState[]> = {
  draft: ['reviewed', 'rejected'],
  reviewed: ['verified', 'variant_linked', 'rejected', 'draft'],
  verified: ['published', 'draft', 'rejected'],
  published: ['draft', 'verified'], // can be pulled back to draft if a dispute arises
  rejected: ['draft'],
  variant_linked: ['draft'],
};

export function canTransition(currentState: CurationState, targetState: CurationState): boolean {
  const allowed = ALLOWED_STATE_TRANSITIONS[currentState];
  return allowed ? allowed.includes(targetState) : false;
}

export function validateStateTransition(
  currentState: CurationState,
  targetState: CurationState
): { allowed: boolean; message: string } {
  if (currentState === targetState) {
    return { allowed: true, message: `स्थिती आधीच '${currentState}' आहे.` };
  }

  if (canTransition(currentState, targetState)) {
    return {
      allowed: true,
      message: `स्थिती यशस्वीरीत्या '${currentState}' वरून '${targetState}' मध्ये बदलली.`,
    };
  }

  return {
    allowed: false,
    message: `अवैध स्थित्यंतर: '${currentState}' वरून '${targetState}' मध्ये जाण्याची परवानगी नाही.`,
  };
}
