/**
 * What a page wants its companion to do right now.
 *
 * The chat on Mnemora sets a mood while a conversation happens (listening,
 * thinking, happy...). The scroll companion reads it when it is docked in
 * the chat's seat. Kept outside React so the motion ticker can read it every
 * frame without re-rendering anything.
 */
let chatMood: string | null = null;
const listeners = new Set<(mood: string | null) => void>();

export function setChatMood(mood: string | null): void {
  if (mood === chatMood) return;
  chatMood = mood;
  listeners.forEach((fn) => fn(chatMood));
}

export function getChatMood(): string | null {
  return chatMood;
}

export function subscribeChatMood(fn: (mood: string | null) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** The element a companion should sit in while it is on screen, if any. */
export const SEAT_SELECTOR = "[data-companion-seat]";
