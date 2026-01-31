const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';
const SLOT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? '';
const SLOT_SIDEBAR = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '';

export const adsConfig = {
  client: ADSENSE_CLIENT,
  slotBottom: SLOT_BOTTOM,
  slotSidebar: SLOT_SIDEBAR,
  hasBottomSlot: Boolean(SLOT_BOTTOM),
  hasSidebarSlot: Boolean(SLOT_SIDEBAR),
} as const;
