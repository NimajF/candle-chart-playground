import type { Theme } from '../theme/model';

interface PresetPickerProps {
  presets: readonly Theme[];
  activeId: string;
  onSelect: (theme: Theme) => void;
}

export function PresetPicker({ presets, activeId, onSelect }: PresetPickerProps) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {presets.map((preset) => {
        const isActive = preset.id === activeId;

        return (
          <li key={preset.id}>
            <button
              type="button"
              onClick={() => onSelect(preset)}
              aria-pressed={isActive}
              className={`flex w-full flex-col gap-2 rounded-lg border p-2 text-left text-xs transition-colors ${
                isActive ? 'border-zinc-300 bg-zinc-800' : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {/* Swatch: background with an up and a down bar */}
              <div
                className="flex h-10 items-end justify-center gap-1.5 rounded border border-zinc-700 pb-2"
                style={{ backgroundColor: preset.colors.background }}
              >
                <div
                  className="h-5 w-2 rounded-sm"
                  style={{ backgroundColor: preset.colors.upBody }}
                />
                <div
                  className="h-3 w-2 rounded-sm"
                  style={{ backgroundColor: preset.colors.downBody }}
                />
              </div>

              <span>{preset.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
