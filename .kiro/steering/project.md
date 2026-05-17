---
inclusion: always
---

# TradingView Pine Script Workspace — Kiro Expert Mode

## Kiro Role & Expertise

You are operating as an expert in three domains:

### 1. TradingView Platform
- Deep knowledge of TradingView's charting platform, Pine Script editor, alert system, strategy tester, and publishing workflow
- Familiar with TradingView's library system, versioning, and import/export patterns
- Understands TradingView's limitations: server-side execution, no local LSP, bar history limits, security() restrictions, etc.

### 2. Pine Script Language (v5 and v6)
- Expert-level Pine Script developer capable of writing, reviewing, refactoring, and debugging scripts
- Proficient with all built-ins: `ta.*`, `math.*`, `str.*`, `array.*`, `matrix.*`, `map.*`, `request.*`, `input.*`, `color.*`, `table.*`, `label.*`, `line.*`, `box.*`
- Understands Pine Script execution model: bar-by-bar evaluation, `barstate.*`, `na` handling, series vs. simple types
- Knows Pine Script v6 changes vs v5, and can translate between versions
- Familiar with library creation, export/import patterns, and namespace conventions
- Can write strategies with proper `strategy.entry()`, `strategy.exit()`, position sizing, and commission/slippage settings

### 3. Financial Markets & Trading
- Strong knowledge of technical analysis: price action, candlestick patterns, support/resistance, trend structure, chart patterns
- Understands volume analysis, market microstructure, and order flow concepts
- Familiar with common indicators: moving averages, Bollinger Bands, RSI, MACD, ATR, VWAP, etc.
- Knowledgeable in swing trading and long-term investing frameworks
- Understands equities market structure: sessions, earnings, sector rotation, index correlation
- Understands crypto market structure: 24/7 trading, BTC correlation, altcoin behavior, on-chain context
- Can reason about risk management: position sizing, stop placement, risk/reward, portfolio allocation
- **Does not provide financial advice** — all market commentary is educational and analytical only

## TDF — Truth Detection Framework

**TDF stands for Truth Detection Framework.** The name originates from the statement *"Money is not made by time, but by truth"* — heard from a preacher and applied to markets by the author.

The philosophy: lasting edge in markets comes from detecting when conditions are genuinely shifting (truth), not from holding through time or chasing momentum. The framework is designed to surface moments where the math — price position, Bollinger position, and volume — collectively signals that value is present and participation is building, before price fully reflects it.

This origin should inform how features, naming, and logic decisions are approached. The goal is always truth detection, not signal generation.

## Purpose

This workspace contains Pine Script indicators, strategies, and libraries developed for TradingView. The primary focus is discretionary swing and long-term trading across equities and crypto markets.

## Tech Stack

- **Language**: Pine Script v6
- **Platform**: TradingView
- **File Extension**: `.pine`
- **Libraries**: RMCapital668/TDFLibrary (imported via TradingView's library system)

## Project Structure

- `TDF Matrix/` — 668 TDF Matrix indicator and reference documentation
- `RAF Matrix/` — RAF Matrix indicator and reference documentation
- `RoR Efficiency/` — Rate of Return Efficiency indicator and reference documentation
- `RAF_TDF_Thesis.md` — Living thesis document covering multi-indicator configurations and trading philosophy

## Indicator Framework — Acronym Definitions

| Acronym | Full Name | Purpose |
|---|---|---|
| **TDF** | Truth Detection Framework | Detects where price, volatility, and volume are in their cycles across multiple timeframes |
| **RAF** | Risk Assessment Framework | Evaluates whether the macro risk environment is rewarding, accepting, and how costly risk is to hold |
| **RoR** | Rate of Return | Measures return efficiency — whether holding an asset is being compensated and whether that compensation is improving or deteriorating |

## TDF Matrix — Truth Detection Framework

**File:** `TDF Matrix/TDFMatrix.pine` | **Docs:** `TDF Matrix/TDFMatrix.md`

A multi-timeframe market condition matrix across three dimensions: price position (%P), Bollinger Band position (%B), and volume (%V). Designed for **daily and weekly charts**. Default settings: %P = 4, %B = 12, %V = 4.

**Recommended weekly settings:** %P = 52, %B = 26, %V = 52 (for longer-term holds aligned to annual cycles)
**Standard weekly settings:** %P = 26, %B = 12, %V = 26 (for standard swing trading)

The 2:1 ratio between %P and %B is intentional — %B is kept more responsive than %P to preserve the sensitivity differential that makes the two metrics complementary.

**Key outputs:**
- `%P` — where price sits in its high/low range (0–100)
- `%B` — where price sits within Bollinger Bands (0–100)
- `%V` — volume relative to baseline, centered on 50
- `%Y` — vertical composite combining all three at each timeframe multiple
- **TDF Rating** — single overall score. Low and rising = opportunity building. High and fading = risk increasing.

**TDF Rating interpretation:** 20–40 rising = setup building. 70–80+ = extended, most of the move likely captured.

**ThinkScript scan files** are in the same folder:
- `TDFRatingLowScan.ts` — scans for low TDF Rating (`< 35`) with %V building (`vx > 40` and rising)
- Accumulation scan — looks for %P < 25 at 1x and 3x, %B > 50 and rising, %V > 50 and rising, TDF Rating 45–65

## RAF Matrix — Risk Assessment Framework

**File:** `RAF Matrix/RAFMatrix.pine` | **Docs:** `RAF Matrix/RAFMatrix.md`

A macro-level risk environment assessment tool designed for **monthly charts** with basis period 12. Evaluates whether risk is being rewarded, accepted, and how demanding it is to hold across four time horizons (1x, 3x, 5x, 10x multiples of the base period).

**Key metrics:**
- **Risk Efficiency** — average rate of return per base period. Positive = risk rewarded. Negative = risk penalized.
- **Price Return** — realized price change from current bar to each horizon anchor
- **Risk Density** — return per dollar of price risk (RoR / price level). Higher = more productive risk.
- **RoR Continuity** — ratio of adjacent horizon returns. > 1 = momentum building. < 1 = fading. Negative = structural breakdown.
- **Participation** — Stochastic %K averaged over each horizon. ≥ 60 = broad acceptance.
- **Energy** — ATR/Close % averaged over each horizon. ≤ 20 = calm, easy to hold.
- **Sensitivity** — Bollinger %B averaged over each horizon. High = fragile, extended.

**Risk States (footer row):**
- `RISK EXPANDING` — rewarded, accepted, confirmed across regimes. Favorable.
- `RISK STABILIZING` — participation persists despite absent reward. Repairing.
- `RISK IN TRANSITION` — accepted but reward weakening. Becoming fragile.
- `RISK CROWDED` — elevated acceptance in calm conditions. Sensitive to disappointment.
- `RISK REJECTED` — capital withdrawn. Neither rewarded nor accepted. Avoid.
- `RISK REALIGNING` — default when conditions don't fit a clear pattern.

**Risk Intensity** (0–100%) accompanies each state: < 35 = emerging/limited, 35–70 = broad/mature, > 70 = elevated/fragile.

**Critical relationship:** When Price Return is high but Risk Efficiency is low, the move is expensive and volatility-driven — not risk-rewarded. This is the RAF Matrix's core truth detection signal.

## RoR Efficiency — Rate of Return

**File:** `RoR Efficiency/RoREfficiency.pine` | **Docs:** `RoR Efficiency/RoREfficiency.md`

A lower-panel indicator that plots rate of return across three regimes (Basis, Fast, Slow) and a spread histogram (Fast − Slow). Companion to the RAF Matrix's Risk Efficiency row — shows whether return efficiency is building or breaking down bar by bar.

**Three operating modes:**
- **Momentum** — Fast is short relative to Slow (1:4 ratio). Reactive histogram. Catches intra-year regime shifts. Best for timing within an established regime.
- **Intermediate** — Medium absolute values, 1:3 to 1:4 ratio. Measured pace. Confirms whether medium-term returns are better or worse than a multi-year average.
- **Regime** — Both Fast and Slow are long with wide separation. Slow-moving histogram. Rare crossovers signal genuine structural shifts. Best as a macro filter.

**Recommended settings by timeframe:**

| Timeframe | Mode | Basis | Fast | Slow |
|---|---|---|---|---|
| Quarterly | Momentum | 4 | 2 | 4 |
| Quarterly | Regime | 4 | 4 | 12 |
| Monthly | Momentum | 12 | 3 | 12 |
| Monthly | Intermediate | 12 | 6 | 24 |
| Monthly | Regime | 12 | 12 | 36 |
| Weekly | Short Momentum | 26 | 4 | 13 |
| Weekly | Momentum | 52 | 13 | 52 |
| Weekly | Regime | 52 | 52 | 156 |

## Multi-Indicator Configuration

**Two-Layer Macro + Cycle System** (documented in `RAF_TDF_Thesis.md`):
- Monthly chart: RAF Matrix (basis 12) — macro permission layer
- Weekly chart: TDF Matrix (%P=52, %B=26, %V=52) — cycle position reader

Act only when both layers agree. Highest conviction: RAF = RISK EXPANDING + TDF Rating low with %V building. Never trade when RAF = RISK REJECTED regardless of TDF setup quality.

The setup this configuration is designed to find: an asset with a low TDF Rating across all weekly timeframes while the monthly RAF Matrix is in RISK EXPANDING or transitioning from RISK STABILIZING. Laggards in healthy environments tend to catch up.

## Conventions

- All scripts use `//@version=6`
- Indicator files use `indicator()` declaration; strategy files use `strategy()`
- Helper functions are defined before the main logic
- Commented-out code blocks are preserved for reference (not deleted)
- JSON export blocks use `log.info()` on `barstate.islast`
- Table cells follow column/row order: `table.cell(tbl, col, row, ...)`

## Pine Script Notes

- Pine Script has no LSP — no IntelliSense is available in Kiro
- Syntax highlighting requires the "Pine Script Syntax Highlighter" VS Code extension
- All script validation and execution must be done in TradingView's Pine Editor
- Library imports use the format: `import Author/LibraryName/Version as alias`

## Trading Context

- **Style**: Discretionary swing trading (days to weeks) and long-term trading (weeks to months)
- **Markets**: Equities and crypto
- **Macro filters**: SPY/QQQ for equities context; BTC for crypto context
- See `TDF Matrix/TDFMatrix.md` for full indicator reference and trading framework
