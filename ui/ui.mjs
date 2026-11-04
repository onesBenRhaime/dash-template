// ES module entry point for Dash UI.
//   import UI from './ui/ui.mjs';
// ui.js is a classic script that assigns window.UI; importing it here runs it
// once and re-exports the same object, so both entry points share state.
import './ui.js';

const UI = globalThis.UI;
export default UI;
export const {
  $, $$, esc, attrs,
  icons, icon, addIcons, theme,
  btn, iconBtn, pill, avatar, toggle, seg, meter, dots, progress, kbd,
  card, kpi, tabs, field, search, table, empty, timeline,
  rail, topbar, shell,
  modal, closeModal, drawer, closeDrawer, popover, closePopover, confirm, toast, palette,
  series, sparkline, lineChart, donut, ring, barChart,
  router, shortcuts, downloadCSV,
} = UI;
