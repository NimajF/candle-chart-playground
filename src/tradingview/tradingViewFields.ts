import type { ColorKey } from '../theme/model';

interface TradingViewField {
  label: string; // the name TradingView shows, like "Body"
  up?: ColorKey;
  down?: ColorKey;
  single?: ColorKey; // fields with one color (Background)
}

interface TradingViewSection {
  tab: string; // "Symbol" | "Canvas"
  fields: TradingViewField[];
}

export const TRADINGVIEW_SECTIONS: TradingViewSection[] = [
  {
    tab: 'Symbol',
    fields: [
      { label: 'Body', up: 'upBody', down: 'downBody' },
      { label: 'Borders', up: 'upBorder', down: 'downBorder' },
      { label: 'Wick', up: 'upWick', down: 'downWick' },
    ],
  },
  { tab: 'Canvas', fields: [{ label: 'Background', single: 'background' }] },
];
