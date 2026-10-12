// Kept out of story-scroll.tsx: a non-component export there would turn every
// edit to that file into a full page reload instead of a Fast Refresh.

export const FLOW_RELAYOUT_EVENT = "flowrelayout";

/**
 * Tells the enclosing FlowArt that the panel holding `el` has changed height,
 * so its pin is re-measured. Call it once the change is in the DOM and before
 * the browser paints (flushSync in an event handler, or a layout effect).
 * Outside a FlowArt the event goes unheard, which is harmless.
 */
export function requestFlowRelayout(el: Element) {
  el.dispatchEvent(new Event(FLOW_RELAYOUT_EVENT, { bubbles: true }));
}
