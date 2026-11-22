import { useState } from 'react';
import { ChartLineUpIcon, PaletteIcon, SwatchesIcon, type Icon } from '@phosphor-icons/react';
import type { Theme } from '../theme/model';
import type { ColorLocks } from '../theme/randomColors';
import type { CandleParams } from '../chart/types';
import type { AppTheme } from '../app-theme/useAppTheme';
import type { ThemeEditor } from '../editor/useThemeEditor';
import { ThemeList, ThemeListHeader } from '../editor/ThemeList';
import { MobileColorEditor } from '../editor/MobileColorEditor';
import { CandleControls } from '../chart/CandleControls';
import { InfoButton } from '../ui/InfoButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TradingViewLink } from '../tradingview/TradingViewLink';

type MobileTab = 'colors' | 'themes' | 'data';

const TABS: { id: MobileTab; label: string; icon: Icon }[] = [
  { id: 'colors', label: 'Colors', icon: PaletteIcon },
  { id: 'themes', label: 'Themes', icon: SwatchesIcon },
  { id: 'data', label: 'Data', icon: ChartLineUpIcon },
];

interface MobilePanelProps {
  editor: ThemeEditor;
  themes: readonly Theme[]; // every theme: the tab has room for all of them
  onPickTheme: (theme: Theme) => void;
  onDeleteTheme: (theme: Theme) => void;
  onRandomizeColors: (locks: ColorLocks) => void;
  candleParams: CandleParams;
  onCandleParamsChange: (params: CandleParams) => void;
  onApplyCandles: () => void;
  onRandomizeCandles: () => void;
  appTheme: AppTheme;
  onToggleAppTheme: () => void;
  onOpenInfo: () => void;
  onOpenTradingView: () => void;
}

// Mobile: the panel below the chart.
export function MobilePanel(props: MobilePanelProps) {
  const [tab, setTab] = useState<MobileTab>('colors');

  return (
    <aside className="flex min-h-0 flex-col border-t border-line bg-surface">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4">
        {tab === 'colors' && (
          <div className="space-y-4">
            <MobileColorEditor
              colors={props.editor.colors}
              onChange={props.editor.setColor}
              onRandomize={props.onRandomizeColors}
            />
            <TradingViewLink onClick={props.onOpenTradingView} />
          </div>
        )}

        {tab === 'themes' && (
          // Full-bleed list: cancels the panel padding so rows reach the edges
          <div className="-mx-4">
            <ThemeListHeader />
            <ThemeList
              themes={props.themes}
              activeId={props.editor.base.id}
              onSelect={props.onPickTheme}
              onDelete={props.onDeleteTheme}
            />
          </div>
        )}

        {tab === 'data' && (
          <CandleControls
            params={props.candleParams}
            onChange={props.onCandleParamsChange}
            onApply={props.onApplyCandles}
            onRandomize={props.onRandomizeCandles}
            // App-level settings share the actions row, so the whole tab fits without scrolling
            leadingActions={
              <>
                <InfoButton onClick={props.onOpenInfo} />
                <ThemeToggle theme={props.appTheme} onToggle={props.onToggleAppTheme} />
              </>
            }
          />
        )}
      </div>

      <div role="tablist" className="flex shrink-0 border-t border-line">
        {TABS.map((item) => {
          const isActive = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 pt-2 pb-2.5 text-[11px] font-semibold transition-colors duration-150 ease-soft ${
                isActive ? 'text-accent-ink' : 'text-fg-faint hover:text-fg'
              }`}
            >
              <item.icon size={22} weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
