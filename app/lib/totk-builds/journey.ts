type JourneyWindow = Window & {
  $adManagementConfig?: { web?: { fillHints?: () => unknown } };
};

let scheduled = false;

/** The active Journey wrapper exposes fillHints for .mv_slot_target markers.
 * Coalesce new islands into one scan. If it is not ready yet, its normal
 * initialization will scan them; never load another wrapper or poll forever. */
export function scheduleJourneySlots(): void {
  if (typeof window === 'undefined' || scheduled) return;
  const current = window as JourneyWindow;
  if (typeof current.$adManagementConfig?.web?.fillHints !== 'function') return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    try { current.$adManagementConfig?.web?.fillHints?.(); }
    catch (error) { console.warn('Unable to register build catalogue ad slots', error); }
  });
}
