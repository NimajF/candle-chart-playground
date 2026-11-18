// A frame-driven replica of the app's layout (header, sample-data bar, chart, sidebar), laid out
// at 1440 × 774 app pixels with absolute positions that match the cursor targets in script.ts.
import type { CSSProperties, ReactNode } from 'react';
import {
  ChartLineUpIcon,
  CheckIcon,
  CopyIcon,
  CornersOutIcon,
  DiceFiveIcon,
  InfoIcon,
  LockSimpleIcon,
  LockSimpleOpenIcon,
  PaletteIcon,
  SunIcon,
  SwatchesIcon,
  TagIcon,
  type Icon,
} from '@phosphor-icons/react';
import type { Theme, ThemeColors } from '../../../src/theme/model';
import { PRESET_THEMES } from '../../../src/theme/presets';
import {
  APP_H,
  APP_W,
  CLICK,
  SAVED_THEME,
  SLIDERS,
  TRACK_W,
  activeThemeAt,
  candlesAt,
  colorsAt,
  isDirtyAt,
  nameAt,
  paramsAt,
  thumbX,
} from '../lib/script';
import { pop, pressScale, progress } from '../lib/anim';
import { DATA_FONT, T, UI_FONT } from '../lib/tokens';
import { Chart } from './Chart';
import { Swatch } from './Swatch';

const SIDEBAR_X = 1120;
const CONTENT_X = 1136;
const CHART_Y = 112;
const FOOTER_Y = 705;
const ROW_H = 36;

function abs(left: number, top: number, width?: number, height?: number): CSSProperties {
  return { position: 'absolute', left, top, width, height };
}

const text = (size: number, color: string, weight = 400): CSSProperties => ({
  fontSize: size,
  color,
  fontWeight: weight,
  lineHeight: 1,
  whiteSpace: 'nowrap',
});

function Divider({ y }: { y: number }) {
  return <div style={{ ...abs(CONTENT_X, y, 288, 1), background: T.line }} />;
}

function SectionTitle({
  icon: IconComponent,
  x,
  y,
  children,
}: {
  icon: Icon;
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        ...abs(x, y),
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...text(14, T.fg, 600),
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          display: 'grid',
          placeItems: 'center',
          borderRadius: T.radiusControl,
          background: T.accentSoft,
          color: T.accent,
        }}
      >
        <IconComponent size={14} weight="bold" />
      </span>
      {children}
    </div>
  );
}

function IconButton({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      style={{
        ...abs(x, y, 34, 34),
        display: 'grid',
        placeItems: 'center',
        borderRadius: T.radiusControl,
        border: `1px solid ${T.line}`,
        background: T.field,
        color: T.fgMuted,
      }}
    >
      {children}
    </div>
  );
}

function RandomizeButton({
  x,
  y,
  frame,
  clicks,
}: {
  x: number;
  y: number;
  frame: number;
  clicks: readonly number[];
}) {
  // Each click spins the dice half a turn, like the app's :active state.
  const spin = clicks.reduce((sum, c) => sum + 180 * progress(frame, c, 10), 0);
  return (
    <div
      style={{
        ...abs(x, y, 114, 32),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: T.radiusControl,
        border: `1px solid ${T.lineStrong}`,
        background: T.field,
        transform: `scale(${pressScale(frame, clicks)})`,
        ...text(12, T.fg, 600),
        letterSpacing: '0.025em',
      }}
    >
      <DiceFiveIcon
        size={18}
        weight="bold"
        color={T.accent}
        style={{ transform: `rotate(${spin - 12}deg)` }}
      />
      Randomize
    </div>
  );
}

function Slider({
  label,
  labelX,
  slider,
  value,
  display,
}: {
  label: string;
  labelX: number;
  slider: keyof typeof SLIDERS;
  value: number;
  display: string;
}) {
  const trackX = SLIDERS[slider].trackX;
  const thumb = thumbX(slider, value);
  return (
    <>
      <span style={{ ...abs(labelX, 77), ...text(14, T.fgMuted) }}>{label}</span>
      <div
        style={{
          ...abs(trackX, 83, TRACK_W, 3),
          borderRadius: 99,
          background: 'rgba(237,237,240,0.14)',
        }}
      />
      <div
        style={{ ...abs(trackX, 83, thumb - trackX, 3), borderRadius: 99, background: T.accent }}
      />
      <div style={{ ...abs(thumb - 6, 78.5, 12, 12), borderRadius: '50%', background: T.accent }} />
      <span style={{ ...abs(trackX + TRACK_W + 8, 79), ...text(12, T.fg), fontFamily: DATA_FONT }}>
        {display}
      </span>
    </>
  );
}

function HexCell({ x, color }: { x: number; color: string }) {
  return (
    <span
      style={{
        ...abs(x, 13),
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        ...text(11, T.fgMuted),
        fontFamily: DATA_FONT,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      {color.slice(1)}
    </span>
  );
}

function ThemeRow({ theme, y, active }: { theme: Theme; y: number; active: boolean }) {
  return (
    <div style={{ ...abs(0, y, 320, ROW_H), background: active ? T.accentSoft : 'transparent' }}>
      <div style={abs(16, 6)}>
        <Swatch colors={theme.colors} width={40} height={24} />
      </div>
      <span style={{ ...abs(68, 11), ...text(14, T.fg) }}>{theme.name}</span>
      <HexCell x={164} color={theme.colors.upBody} />
      <HexCell x={240} color={theme.colors.downBody} />
    </div>
  );
}

function ColorField({
  x,
  y,
  swatch,
  hex,
  hovered = false,
  copied = false,
}: {
  x: number;
  y: number;
  swatch: string;
  hex: string;
  hovered?: boolean;
  copied?: boolean;
}) {
  return (
    <div
      style={{
        ...abs(x, y, 100, 30),
        borderRadius: T.radiusControl,
        border: `1px solid ${hovered ? T.lineStrong : T.line}`,
        background: T.field,
      }}
    >
      <div
        style={{
          ...abs(4, 4, 20, 20),
          borderRadius: 6,
          border: `1px solid ${T.lineStrong}`,
          background: swatch,
        }}
      />
      <span style={{ ...abs(29, 9), ...text(12, T.fg), fontFamily: DATA_FONT }}>{hex}</span>
      {hovered && (
        <div
          style={{
            ...abs(71, 2, 24, 24),
            display: 'grid',
            placeItems: 'center',
            background: T.field,
            color: copied ? T.accent : T.fgMuted,
          }}
        >
          {copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
        </div>
      )}
    </div>
  );
}

function Lock({
  cx,
  cy,
  lockedAt,
  frame,
}: {
  cx: number;
  cy: number;
  lockedAt: number;
  frame: number;
}) {
  const locked = frame >= lockedAt;
  const LockIcon = locked ? LockSimpleIcon : LockSimpleOpenIcon;
  return (
    <div
      style={{
        ...abs(cx - 12, cy - 12, 24, 24),
        display: 'grid',
        placeItems: 'center',
        borderRadius: T.radiusControl,
        color: locked ? T.accent : T.fgFaint,
        background: locked ? T.accentSoft : 'transparent',
        transform: `scale(${pop(frame, lockedAt)})`,
      }}
    >
      <LockIcon size={16} weight={locked ? 'fill' : 'regular'} />
    </div>
  );
}

function FooterButton({
  x,
  label,
  primary,
  enabled,
  scale,
}: {
  x: number;
  label: string;
  primary: boolean;
  enabled: boolean;
  scale: number;
}) {
  const style: CSSProperties = primary
    ? enabled
      ? {
          background: T.accent,
          color: T.accentFg,
          boxShadow: '0 8px 22px -10px rgba(198,242,78,0.7)',
        }
      : { background: T.field, color: T.fgFaint }
    : { border: `1px solid ${T.lineStrong}`, color: enabled ? T.fgMuted : T.fgFaint };
  return (
    <div
      style={{
        ...abs(x, FOOTER_Y + 16, 140, 36),
        display: 'grid',
        placeItems: 'center',
        borderRadius: T.radiusControl,
        transform: `scale(${scale})`,
        ...text(14, T.fg, 600),
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export function AppMock({ frame }: { frame: number }) {
  const { shown, target } = colorsAt(frame);
  const { candles, reveal } = candlesAt(frame);
  const params = paramsAt(frame);
  const name = nameAt(frame);
  const dirty = isDirtyAt(frame);
  const activeId = activeThemeAt(frame);

  // After saving, the new theme slides into the top of the list.
  const insert = progress(frame, CLICK.save, 10);
  const listed: Theme[] = [
    SAVED_THEME,
    ...['lime', 'midnight', 'neon', 'forest'].map((id) => PRESET_THEMES.find((t) => t.id === id)!),
  ];
  const count = PRESET_THEMES.length + (frame >= CLICK.save ? 1 : 0);

  const copyHover = frame >= 628;
  const copied = frame >= CLICK.copy;
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  const field = (key: keyof ThemeColors) => ({ swatch: shown[key], hex: target[key] });

  return (
    <div
      style={{
        position: 'relative',
        width: APP_W,
        height: APP_H,
        overflow: 'hidden',
        background: T.canvas,
        fontFamily: UI_FONT,
        color: T.fg,
      }}
    >
      {/* Header */}
      <div
        style={{
          ...abs(0, 0, APP_W, 56),
          background: T.surface,
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        <span style={{ ...abs(16, 20), ...text(16, T.fg, 600) }}>Candle Theme Playground</span>
        <IconButton x={1331} y={11}>
          <InfoIcon size={16} />
        </IconButton>
        <div style={{ ...abs(1377, 16, 1, 24), background: T.line }} />
        <IconButton x={1390} y={11}>
          <SunIcon size={16} />
        </IconButton>
      </div>

      {/* Sample data bar */}
      <div
        style={{
          ...abs(0, 56, SIDEBAR_X, 56),
          background: T.surface,
          borderBottom: `1px solid ${T.line}`,
        }}
      />
      <SectionTitle icon={ChartLineUpIcon} x={16} y={72}>
        Sample data
      </SectionTitle>
      <Slider
        label="Trend"
        labelX={160}
        slider="trend"
        value={params.drift}
        display={`${(params.drift * 100).toFixed(1)}% / day`}
      />
      <Slider
        label="Volatility"
        labelX={404}
        slider="volatility"
        value={params.volatility}
        display={`${(params.volatility * 100).toFixed(1)}%`}
      />
      <span style={{ ...abs(640, 77), ...text(14, T.fgMuted) }}>Bars</span>
      <div
        style={{
          ...abs(678, 83, TRACK_W, 3),
          borderRadius: 99,
          background: 'rgba(237,237,240,0.14)',
        }}
      />
      <div
        style={{ ...abs(678, 83, TRACK_W * 0.769, 3), borderRadius: 99, background: T.accent }}
      />
      <div
        style={{
          ...abs(678 + TRACK_W * 0.769 - 6, 78.5, 12, 12),
          borderRadius: '50%',
          background: T.accent,
        }}
      />
      <span style={{ ...abs(782, 79), ...text(12, T.fg), fontFamily: DATA_FONT }}>
        {params.count}
      </span>
      <RandomizeButton x={924} y={68} frame={frame} clicks={[CLICK.randomizeCandles]} />
      <div
        style={{
          ...abs(1046, 70, 58, 28),
          display: 'grid',
          placeItems: 'center',
          borderRadius: T.radiusControl,
          background: T.accent,
          transform: `scale(${pressScale(frame, [CLICK.apply])})`,
          ...text(12, T.accentFg, 600),
          letterSpacing: '0.025em',
        }}
      >
        Apply
      </div>

      {/* Chart */}
      <div style={abs(0, CHART_Y, SIDEBAR_X, APP_H - CHART_Y)}>
        <Chart
          candles={candles}
          colors={shown}
          reveal={reveal}
          width={SIDEBAR_X}
          height={APP_H - CHART_Y}
        />
      </div>
      <IconButton x={12} y={CHART_Y + 12}>
        <CornersOutIcon size={16} />
      </IconButton>

      {/* Sidebar */}
      <div
        style={{
          ...abs(SIDEBAR_X, 56, 320, APP_H - 56),
          background: T.surface,
          borderLeft: `1px solid ${T.line}`,
        }}
      />

      <SectionTitle icon={SwatchesIcon} x={CONTENT_X} y={72}>
        Themes
      </SectionTitle>
      <span style={{ ...abs(1345, 78), ...text(12, T.fgMuted, 600) }}>View all ({count})</span>

      <div
        style={{
          ...abs(SIDEBAR_X, 104, 320, 28),
          borderBottom: `1px solid ${T.line}`,
          ...text(11, T.fgFaint),
        }}
      >
        <span style={abs(68, 9)}>Name</span>
        <span style={abs(164, 9)}>Up</span>
        <span style={abs(240, 9)}>Down</span>
      </div>
      <div style={{ ...abs(SIDEBAR_X, 132, 320, ROW_H * 4), overflow: 'hidden' }}>
        {listed.map((theme, i) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            y={(i - 1 + insert) * ROW_H}
            active={theme.id === activeId}
          />
        ))}
      </div>

      <Divider y={296} />

      <SectionTitle icon={TagIcon} x={CONTENT_X} y={316}>
        Name
      </SectionTitle>
      <div
        style={{
          ...abs(CONTENT_X, 350, 288, 38),
          borderRadius: T.radiusControl,
          border: `1px solid ${name.focused ? T.accentLine : T.lineStrong}`,
          background: T.field,
          boxShadow: name.focused ? `0 0 0 4px ${T.accentSoft}` : 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          ...text(14, T.fg, 600),
        }}
      >
        <span style={{ background: name.selected ? 'rgba(198,242,78,0.35)' : 'transparent' }}>
          {name.text}
        </span>
        {name.focused && !name.selected && caretOn && (
          <span style={{ width: 1.5, height: 17, marginLeft: 1, background: T.fg }} />
        )}
      </div>

      <Divider y={408} />

      <SectionTitle icon={PaletteIcon} x={CONTENT_X} y={432}>
        Colors
      </SectionTitle>
      <RandomizeButton x={1310} y={428} frame={frame} clicks={CLICK.randomize} />

      <span style={{ ...abs(CONTENT_X, 485), ...text(12, T.fgMuted) }}>Background</span>
      <ColorField x={1216} y={476} {...field('background')} />
      <Lock cx={1336} cy={491} lockedAt={Infinity} frame={frame} />

      <span style={{ ...abs(1246, 526), ...text(12, T.fgMuted) }}>Up</span>
      <Lock cx={1275} cy={532} lockedAt={CLICK.lockUp} frame={frame} />
      <span style={{ ...abs(1346, 526), ...text(12, T.fgMuted) }}>Down</span>
      <Lock cx={1390} cy={532} lockedAt={CLICK.lockDown} frame={frame} />

      {(
        [
          ['Body', 550, 'upBody', 'downBody'],
          ['Border', 586, 'upBorder', 'downBorder'],
          ['Wick', 622, 'upWick', 'downWick'],
        ] as const
      ).map(([label, y, up, down]) => (
        <div key={label}>
          <span style={{ ...abs(CONTENT_X, y + 9), ...text(12, T.fgMuted) }}>{label}</span>
          <ColorField
            x={1216}
            y={y}
            {...field(up)}
            hovered={up === 'upBody' && copyHover}
            copied={up === 'upBody' && copied}
          />
          <ColorField x={1324} y={y} {...field(down)} />
        </div>
      ))}

      <span
        style={{
          ...abs(CONTENT_X, 662, 288),
          ...text(12, T.fgFaint),
          whiteSpace: 'normal',
          lineHeight: 1.4,
        }}
      >
        Locked groups keep their colors when you randomize.
      </span>

      <div
        style={{
          ...abs(SIDEBAR_X, FOOTER_Y, 320, APP_H - FOOTER_Y),
          background: T.surface,
          borderTop: `1px solid ${T.line}`,
        }}
      />
      <FooterButton x={CONTENT_X} label="Reset" primary={false} enabled={dirty} scale={1} />
      <FooterButton
        x={1284}
        label="Save"
        primary
        enabled={dirty}
        scale={pressScale(frame, [CLICK.save])}
      />
    </div>
  );
}
