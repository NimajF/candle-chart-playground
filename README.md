# Candle Theme Playground

Design color themes for candlestick charts, tweak them live and copy the result into your project.

- Edit candle body, border, wick and background colors with a live preview
- Randomize colors (with per-color locks) and candle data
- Start from presets, save your own themes in the browser
- Light and dark app themes, fullscreen chart

Charts are powered by [TradingView Lightweight Charts™](https://www.tradingview.com/). Candles are randomly generated: synthetic data, not real market data.

## Development

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # type-check and production build into dist/
pnpm lint
pnpm format
```

The app is a static Vite + React SPA with no backend. Saved themes live in `localStorage`.

## Deploy

Any static host works. Build command `pnpm build`, output directory `dist`.

## Credits

| Name | By | License |
| --- | --- | --- |
| [Lightweight Charts™](https://www.tradingview.com/) | TradingView | Apache-2.0 |
| [React](https://react.dev) | Meta | MIT |
| [Phosphor Icons](https://phosphoricons.com) | Phosphor | MIT |
| [Motion](https://motion.dev) | Motion | MIT |
| [react-colorful](https://github.com/omgovich/react-colorful) | Vlad Shilov | MIT |
| [Inter](https://rsms.me/inter/) | Rasmus Andersson | OFL-1.1 |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | JetBrains | OFL-1.1 |

This project is not affiliated with or endorsed by TradingView.

Copyright © Benjamin Francisco. All rights reserved.
