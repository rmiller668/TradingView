# 668 TDF Matrix — Reference Guide

> **Disclaimer:** This document is for informational and reference purposes only. Nothing here constitutes financial advice. All trading decisions are your own responsibility.

---

## Overview

**668 TDF Matrix** is a Pine Script v6 indicator for TradingView that builds a multi-timeframe market condition matrix across three core dimensions: price position, Bollinger Band position, and volume. Core computation is delegated to an imported library (`RMCapital668/TDFLibrary`).

The indicator is a **context tool**, not a signal generator. It tells you *where* you are in market structure — you still need a trigger (price action, pattern, level) to act on it.

---

## Timeframe Multiples

Every metric is evaluated at four multiples of its base period, producing a column for each. With the recommended daily chart settings (%P = 52, %B = 26, %V = 52), the columns map to meaningful annual cycle increments:

| Column | %P Bars | %B Bars | %V Bars | Calendar Approx |
|--------|---------|---------|---------|-----------------|
| 1X     | 52      | 26      | 52      | ~1 year / ~6 months / ~1 year |
| 3X     | 156     | 78      | 156     | ~3 years / ~4 months / ~3 years |
| 5X     | 260     | 130     | 260     | ~5 years / ~6 months / ~5 years |
| 10X    | 520     | 260     | 520     | ~10 years / ~1 year / ~10 years |

Each metric uses its own base period, so the three rows don't share the same lookback window at each column. This is intentional. %P and %V use 52 bars as their base — one trading year — so their columns represent 1, 3, 5, and 10-year price range and volume windows. %B uses 26 bars (half a year) as its base, keeping it more responsive than %P at every column. This 2:1 ratio between %P and %B is deliberate: %B needs to be more sensitive than %P so it can detect when price is starting to recover within its volatility envelope *before* the price range percentile has moved. If both used the same period, they would move in lockstep and lose their complementary relationship.

The **%V baseline** is always `volPeriod × 10` = 520 bars (~2 years of daily data). Every %V column compares its smoothed volume against this same two-year average, so you're always asking "is volume now above or below the two-year norm?"

The **%X column** is the horizontal composite — the average of all four multiples for that row. The **%Y row** is the vertical composite — the average of all three metrics at each multiple. The **TDF Rating** is the final single number combining everything.

---

## Metrics

### %$ — Price Range Percentile

*Where is the current close within the high/low range of this period?*

Measures price position as a percentile of the high/low range over the lookback window. A reading of 0 means close is at the period low; 100 means close is at the period high. This is a pure price location metric — it has no opinion about whether that location is good or bad, only where you are.

```
getPctP(period) =>
    hi = ta.highest(high, period)
    lo = ta.lowest(low, period)
    (close - lo) / (hi - lo) * 100    -- rounded to nearest integer
```

The four columns are computed at `prPeriod × 1`, `× 3`, `× 5`, `× 10`. The **%X** composite is their simple average:

```
p1  = getPctP(52)    -- 1-year high/low range
p3  = getPctP(156)   -- 3-year high/low range
p5  = getPctP(260)   -- 5-year high/low range
p10 = getPctP(520)   -- 10-year high/low range
px  = (p1 + p3 + p5 + p10) / 4
```

With a 52-bar base, each column answers a meaningfully different question. The 1X column asks where price sits within the past year's range — a standard annual cycle. The 3X column asks where it sits within a 3-year range, which captures a full business cycle in most equities. The 5X and 10X columns provide the structural backdrop — where is this asset in its multi-year history?

**What the spread tells you:** If 1X is low but 10X is still mid-range or higher, price has pulled back within a larger uptrend — a potential dip-buying zone. This is the most common setup signature: short-term weakness within long-term structural health. If all four columns are low together, the asset has been weak across every timeframe — either a structural breakdown or a deep value opportunity depending on the other metrics. If all four are high, price is extended across every timeframe — not a place to be adding.

**Color:** Intensity-based using the Participation color (dark red). Higher readings produce a stronger, more saturated color.

---

### %B — Bollinger Band Percentile

*Where is price within its volatility envelope?*

Measures where the current close sits within the Bollinger Bands (2 standard deviations around an SMA). A reading of 0 means price is at the lower band; 100 means price is at the upper band; 50 means price is exactly at the moving average. Values can exceed 0–100 when price breaks outside the bands.

```
getPctB(period) =>
    basis = ta.sma(close, period)
    dev   = 2.0 * ta.stdev(close, period)
    upper = basis + dev
    lower = basis - dev
    (close - lower) / (upper - lower) * 100    -- rounded to nearest integer
```

The four columns are computed at `bbPeriod × 1`, `× 3`, `× 5`, `× 10`. The **%X** composite is their simple average:

```
b1  = getPctB(26)    -- 6-month Bollinger envelope
b3  = getPctB(78)    -- ~4-month Bollinger envelope (3 × 26)
b5  = getPctB(130)   -- ~6-month Bollinger envelope (5 × 26)
b10 = getPctB(260)   -- 1-year Bollinger envelope (10 × 26)
bx  = (b1 + b3 + b5 + b10) / 4
```

Using 26 as the %B base (half the %P base of 52) means %B is always operating at a finer resolution than %P at every column. The 1X %B window (26 bars) is half the size of the 1X %P window (52 bars), so %B will respond to volatility compression and expansion faster than %P responds to price range position. This is the sensitivity differential that makes the two metrics complementary rather than redundant.

**How %B differs from %$:** %$ uses the raw high/low range — it's purely about where price is relative to recent extremes. %B uses a volatility-adjusted envelope — it tells you whether price is statistically extended or compressed relative to its own recent behavior. A low %$ with a rising %B is a particularly useful combination: price is still near the bottom of its annual range, but it has pushed back above the 6-month moving average within the Bollinger envelope. The compression is resolving before the price range has moved.

**What the spread tells you:** Low %B across multiple timeframes means price is compressed or oversold relative to its own volatility history at each of those scales. This is the "not chasing" confirmation — you're buying near the band, not in the middle of a move. High %B across multiple timeframes means price is extended and fragile at every scale.

**Color:** Intensity-based using the Position color (blue). Higher readings produce a stronger color.

---

### %V — Volume Percentile

*Is participation building or fading relative to the baseline?*

Normalizes volume relative to a long-term baseline SMA, then scales the result so that the baseline equals 50. A reading of 50 means current volume exactly matches the baseline. Above 50 means volume is above average (participation present). Below 50 means volume is below average (low conviction).

```
getPctV(period, baseline) =>
    v    = ta.sma(volume, period)
    base = ta.sma(volume, baseline)
    (v / base) * 50
```

The baseline is always `volPeriod × 10` regardless of which column is being computed. The four columns use different smoothing windows for the numerator, but they all compare against the same long-term baseline:

```
-- baseline = 52 × 10 = 520 bars (~2 years of daily data)
v1  = getPctV(52,  520)   -- 1-year avg volume vs 2-year baseline
v3  = getPctV(156, 520)   -- 3-year avg volume vs 2-year baseline
v5  = getPctV(260, 520)   -- 5-year avg volume vs 2-year baseline
v10 = 50.0                -- hardcoded: baseline equals itself
vx  = (v1 + v3 + v5 + v10) / 4
```

**Why v10 is hardcoded to 50:** The 10X window (520 bars) uses the same length as the baseline, so `v / base` always equals 1.0, and `1.0 × 50 = 50`. It's structurally fixed at the midpoint and serves as an anchor in the composite average.

**Why a 2-year baseline matters:** Using a 520-bar baseline on a daily chart means you're comparing current volume behavior against two full years of trading activity. This is long enough to smooth out seasonal patterns, earnings cycles, and short-term spikes, giving you a stable reference for what "normal" participation looks like for this asset. A v1 reading above 50 means the past year's average volume is running above that 2-year norm — genuine participation building, not a one-week anomaly.

**What the spread tells you:** %V rising at 1X while 3X and 5X are still near 50 means fresh participation is entering — money is showing up in the short term before it's visible in the longer averages. This is the early accumulation signal. %V fading at 1X while 3X and 5X are still elevated means the recent burst of activity is cooling — distribution or exhaustion. When v1 and v3 are both above 50 and rising, participation is broad and sustained across both the 1-year and 3-year windows — the strongest volume confirmation.

**Important note on crypto:** Volume data in crypto is exchange-dependent and erratic. %V readings are directionally useful but should be weighted less heavily than in equities, where volume has clear session patterns and more reliable baselines.

**Color:** Intensity-based using the Breadth/Energy color (dark yellow). Higher readings produce a stronger color.

---

## Composite Rows

### %Y — Vertical Composite

*What is the overall condition at each timeframe multiple?*

Combines all three metrics (%$, %B, %V) at each column into a single score. This is the vertical slice — it tells you how aligned the three dimensions are at each timeframe.

```
y1  = (p1 + b1 + v1) / 3
y3  = (p3 + b3 + v3) / 3
y5  = (p5 + b5 + v5) / 3
y10 = (p10 + b10 + v10) / 3
```

A low %Y at 1X and 3X with a higher %Y at 10X is the classic setup signature: short-term weakness within a longer-term structure that is still intact. All four %Y values low together is either deep value or structural breakdown — the %B and %V readings distinguish which.

**Color:** Gradient from `colorLow` (red) to `colorHigh` (green), mapped 0–100.

---

### TDF Rating

*What is the single overall market condition score?*

The TDF Rating is the final composite of everything — all three metrics across all four timeframes, averaged two ways and then combined. It is computed as the average of the horizontal composite (%X average) and the vertical composite (%Y average):

```
-- Horizontal composites (average across timeframes per metric)
px = (p1 + p3 + p5 + p10) / 4
bx = (b1 + b3 + b5 + b10) / 4
vx = (v1 + v3 + v5 + v10) / 4
xComposite = (px + bx + vx) / 3

-- Vertical composites (average across metrics per timeframe)
y1  = (p1 + b1 + v1) / 3
y3  = (p3 + b3 + v3) / 3
y5  = (p5 + b5 + v5) / 3
y10 = (p10 + b10 + v10) / 3
yComposite = (y1 + y3 + y5 + y10) / 4

-- Final rating
TDF Rating = (xComposite + yComposite) / 2
```

By averaging both the horizontal and vertical composites before combining them, the rating gives equal weight to the cross-timeframe consistency of each metric *and* the cross-metric alignment at each timeframe. A low rating requires weakness to be present in multiple dimensions and at multiple scales simultaneously — not just one bad reading.

**Interpretation:**
- **20–40, rising** — setup building from compressed conditions. Opportunity zone.
- **40–65** — neutral / transitional. No strong directional edge.
- **65–75** — conditions extended. Most of the move likely captured.
- **75+** — elevated risk. Not a place to be adding exposure.

**Color:** Gradient from `colorLow` to `colorHigh`, mapped 0–100.

---

## TDF States

The footer row translates the matrix into a named market condition. The state is determined by `getMatrixState()` in the library, which evaluates a set of boolean flags against `p1`, `p3`, `p5`, `b1`, `b3`, `v1`, `v3`, and the TDF Rating.

Eight states are possible, evaluated in priority order:

---

### 🟩 Participation
*Strong conditions confirmed across all three dimensions.*

```
p1 > 50  AND  p1 >= p3          -- price leading, not lagging
b1 > 60  AND  b1 >= b3          -- BB position strong and leading
v1 > 70  AND  v3 > 70           -- volume elevated at both short and medium term
rating > 65
```

Price is in the upper half of its range and leading the medium-term. Bollinger position is strong and not fading. Volume is elevated at both 1X and 3X — this isn't a one-bar spike, it's sustained. The overall rating confirms broad alignment. This is the fully confirmed uptrend state.

---

### 🟧 Early Participation
*Strength building but volume not yet fully confirmed.*

```
p1 > 50  AND  p1 >= p3
b1 > 60  AND  b1 >= b3
v1 >= 60  AND  v1 >= v3
(v1 < 70  OR  v3 < 70)          -- volume supportive but not yet at full threshold
rating > 65
```

Same price and Bollinger conditions as Participation, but volume hasn't crossed the 70 threshold at both timeframes yet. The move is real but not yet fully sponsored. This is the state to watch — if volume confirms, it transitions to full Participation.

---

### 🟦 Accumulation
*Price weak, but Bollinger and volume are recovering from longer-term base.*

```
p1 < 25  AND  p3 < 25           -- price near the bottom of its range
b1 > 50  AND  b1 >= b3          -- BB position above midpoint and leading
v1 > 50  AND  v1 >= v3          -- volume above baseline and leading
rating > 45  AND  rating < 65
```

Price is still low in its range — this doesn't look good on the surface. But %B has crossed above 50 and is leading the medium-term, meaning price has pushed back above its moving average within the Bollinger envelope. Volume is above baseline and building. The rating is in the neutral-to-moderate zone. This is the early recovery pattern: price hasn't moved yet, but the internal structure is improving. The setup is building before the price move is visible.

---

### 🟥 Capitulation
*Price and Bollinger failing, volume either spiking or collapsing.*

```
p1 < 20  AND  p3 < 20           -- price at the bottom of its range
b1 < 25  AND  b1 <= b3          -- BB position near lower band and weakening
(v1 < 40 AND v1 <= v3)          -- volume drying up (quiet selling)
OR (v1 > 70 AND v1 >= v3)       -- OR volume spiking (forced selling)
rating < 40
```

Price is at the bottom of its range across both short and medium timeframes. Bollinger position is near the lower band and deteriorating. Volume is either collapsing (quiet capitulation — sellers exhausted) or spiking (forced selling — panic). Both volume patterns qualify because both represent a breakdown in normal market function. The rating confirms broad weakness. This is the washout state — potentially the end of a move down, but not a buy signal on its own.

---

### ⬜ Transition
*No clear stack leadership. Conditions are mixed.*

```
rating >= 40  AND  rating <= 65
AND not Participation
AND not Early Participation
AND not Accumulation
AND not Capitulation
```

The rating is in the neutral zone and no other state's conditions are met. The matrix doesn't have a clear directional story. This is the most common state during sideways markets or after a trend has ended but before a new one has established. Not a place to be adding exposure in either direction.

---

### 🟨 Fading Participation
*High rating but short-term metrics are weakening relative to medium-term.*

```
NOT Participation  AND  NOT Early Participation
rating > 65
(p1 < p3  OR  b1 < b3  OR  v1 < v3)    -- at least one metric is fading
```

The overall rating is still elevated, but the short-term readings are starting to lag behind the medium-term. The trend is intact on the surface but losing internal momentum. This is the distribution warning state — the move is still showing a high rating, but the leading indicators within the matrix are rolling over. Start thinking about trimming, not adding.

---

### 🟪 Fading Capitulation
*Low rating but short-term metrics are recovering relative to medium-term.*

```
NOT Capitulation
rating < 40
(p1 > p3  OR  b1 > b3  OR  v1 > v3)    -- at least one metric is recovering
```

The overall rating is still low, but the short-term readings are starting to lead the medium-term higher. The worst of the selling is likely behind. This is the early recovery signal — not a confirmed buy, but the internal structure is beginning to repair. Watch for this to transition into Accumulation as %B and %V build further.

---

### ⬛ No Clear Structure
*Default when no state conditions are met.*

Disqualified stack or composite misalignment. The matrix readings don't fit any recognized pattern. Treat as noise.

---

## Visual Layout

A 6×6 table with timeframe multiples across columns and metrics down rows:

|        | 10X | 5X | 3X | 1X | %X |
|--------|-----|----|----|----|----|
| **%$** | ... | .. | .. | .. | avg of 1X–10X |
| **%B** | ... | .. | .. | .. | avg of 1X–10X |
| **%V** | ... | .. | .. | .. | avg of 1X–10X |
| **%Y** | ... | .. | .. | .. | TDF Rating |
| *(State Description — merged footer row)* |

- **Read columns left to right** — 10X is the structural backdrop, 1X is the current condition
- **Read rows top to bottom** — %$ is price location, %B is volatility position, %V is participation
- **%Y** is the vertical summary of each column; **TDF Rating** is the single number summary of everything
- Cell colors use intensity-based shading for %$, %B, %V rows; gradient shading for %Y and TDF Rating

---

## JSON Export

On the last bar, the full matrix is serialized to a compact JSON string and emitted via `log.info()` — viewable in the Pine Script console. Useful for external consumption or debugging.

Example structure:
```json
{
  "Symbol": "AAPL",
  "Timeframe": "D",
  "matrix": {
    "%$": { "10X": "42%", "5X": "38%", "3X": "35%", "1X": "28%", "%X": "25%" },
    "%B": { "10X": "45%", "5X": "40%", "3X": "36%", "1X": "30%", "%X": "27%" },
    "%V": { "10X": "55%", "5X": "58%", "3X": "62%", "1X": "65%", "%X": "68%" },
    "%Y": { "10X": "47%", "5X": "45%", "3X": "44%", "1X": "41%" },
    "TDF Rating": "38%"
  }
}
```

---

## Inputs / Settings

| Input | Default | Description |
|-------|---------|-------------|
| %P Basis | 52 | Base period for price range percentile. On a daily chart, 52 bars ≈ 1 trading year. Multiples produce 1, 3, 5, and 10-year range windows. |
| %B Basis | 26 | Base period for Bollinger Band %B. Set at half the %P basis to keep %B more responsive than %P at every column. On a daily chart, 26 bars ≈ 6 months. |
| %V Basis | 52 | Base period for volume. Baseline is always 10× this value (520 bars ≈ 2 years). Columns compare 1, 3, and 5-year volume averages against that 2-year norm. |
| Begin Color | Red | Low end of gradient shading |
| End Color | Green | High end of gradient shading |
| Participation | Dark Red | Color for %$ row |
| Breadth | Dark Yellow | Color for %V row |
| Position | Blue | Color for %B row |
| Text Color | White | Text color for values |
| Headings | Gray | Background color for table headings |
| Opacity | 50 | Gradient shading opacity level for %Y and TDF Rating cells |

**Recommended settings by timeframe:**

| Timeframe | %P Basis | %B Basis | %V Basis | Notes |
|-----------|----------|----------|----------|-------|
| Daily (annual cycles) | 52 | 26 | 52 | Recommended. 1X = 1yr range / 6mo BB / 1yr vol. |
| Weekly (standard swing) | 26 | 12 | 26 | 1X ≈ 6 months. Faster-moving. |
| Weekly (long-term) | 52 | 26 | 52 | 1X ≈ 1 year on weekly bars. |
| Daily (short-term swing) | 4 | 12 | 4 | Original default. 1X ≈ 1 week. Much faster. |

---

## Trading with the TDF Matrix

### General Principles

- **Confluence is the edge** — look for alignment across multiple timeframes and dimensions, not just one reading
- **The timeframe multiples reveal structure** — if 1X is extreme but 10X is neutral, it's a short-term condition; if all four multiples align, it's a significant structural condition
- **TDF Rating is your summary** — low and rising = opportunity building; high and fading = risk increasing
- **The state description is your context** — it tells you what kind of low or high you're looking at (Accumulation vs. Capitulation are both low, but they mean very different things)

### Reading the Matrix

| Condition | What It Means |
|-----------|---------------|
| %$ low across 3X, 5X, 10X | Price has pulled back meaningfully — potential value zone |
| %B low | Price near or below lower Bollinger Band — not chasing |
| %V rising above 50 | Volume/participation building — conviction entering |
| %Y turning up from low | Composite momentum starting to recover |
| TDF Rating 20–40, rising | Setup building from compressed conditions |
| TDF Rating 70–80+ | Extended conditions — most of the move likely captured |
| %$ and %B high, %V fading | Price moved without volume conviction — distribution warning |
| State = Accumulation | %B and %V recovering while %$ still low — setup before the price move |
| State = Fading Participation | Short-term metrics rolling over — start thinking about exits |
| State = Fading Capitulation | Panic fading, internal structure repairing — watch for Accumulation next |

### The Key Relationship: %$ vs. %B

These two metrics often diverge in the most useful ways. %$ is a raw location metric — it just tells you where price is in its range. %B is volatility-adjusted — it tells you where price is relative to its own statistical behavior.

- **%$ low, %B rising** — price is still near the bottom of its range, but it has pushed back above the lower Bollinger Band. The compression is resolving. This is the early recovery signal.
- **%$ low, %B also low** — price is near the range bottom *and* near the lower band. Still in the damage zone. Wait for %B to recover.
- **%$ high, %B high** — price is extended in both absolute and volatility-adjusted terms. Fragile.
- **%$ high, %B moderate** — price has moved up in its range but isn't statistically extended. The move may have more room.

---

## Swing Trading (Days to Weeks)

### Entry Context
- %$ under 30 on 3X and 5X columns — price is in the lower portion of its 3 and 5-year range
- %B low — near or at the lower Bollinger Band, not chasing into a move
- %V rising above 50 — annual volume running above the 2-year baseline
- %Y composite turning up from low readings
- TDF Rating in the 20–40 range starting to recover
- State = Accumulation or Fading Capitulation

Then look at the chart for the actual trigger — support level, candlestick reversal, short-term range breakout.

### Exit / Take Profit Context
- %$ climbs above 70–80 across 1X and 3X — price extended in its 1 and 3-year range
- %B pushes above 80 — price extended into the upper Bollinger Band
- %V starts fading while price is high — distribution signal
- TDF Rating above 75 — most of the move likely captured
- State = Fading Participation

---

## Long-Term Trading (Weeks to Months)

### Accumulation Zone
- 10X %$ under 35 — price is in the lower third of its 10-year range
- 10X %B under 40 — structurally oversold relative to the 10-year Bollinger envelope
- %V at 1X or 3X starting to build above 50 — annual or multi-year volume recovering above the 2-year baseline
- TDF Rating under 35
- State = Accumulation or Capitulation (watch for the transition)

With 52-bar settings on a daily chart, the 10X column represents a 520-bar (~10-year) lookback. A low 10X %$ means price is near the bottom of a decade-long range — this is structural value, not a short-term dip. These are the setups worth building meaningful positions around.

### Hold vs. Trim Decision
- As long as 10X %$ and %B stay below 65 and %V remains above 50, the trend has structural room
- When 10X readings push above 70–75, the asset is extended on a multi-year basis — start thinking about trimming or tightening stops
- If %V collapses at 1X while price is high across all timeframes — warning that annual participation is fading while price is extended
- State = Fading Participation is the formal signal to begin reducing

---

## Equities-Specific Notes

- **Timeframe**: Daily chart with %P = 52, %B = 26, %V = 52. This aligns the matrix to annual cycles, which is the natural rhythm of equity markets — earnings cycles, fiscal years, seasonal patterns.
- **%V is especially meaningful** — equity volume has clear session patterns and a stable baseline. A v1 reading above 50 means the past year's average daily volume is running above the 2-year norm — genuine institutional participation, not noise. Rising %V on a pullback to support is one of the strongest confirmation signals the matrix produces.
- **Earnings risk** — the matrix cannot see earnings dates. A low TDF Rating going into earnings looks like a setup but carries binary risk. Always check the calendar before entering.
- **Sector/macro context** — if SPY/QQQ has a high TDF Rating (extended), even a low-rated individual stock may struggle. Use the matrix on the index as a macro filter. A low-rated stock in a high-rated index is a laggard, not necessarily a value opportunity.
- **Best setups**: 1X and 3X %$ low (price weak in the 1 and 3-year range) while 10X %$ is still mid-range or higher (10-year structure intact). This is the trend continuation / dip-buying setup — you're buying a pullback within a healthy long-term structure, not a breakdown.

---

## Crypto-Specific Notes

- **%V baseline is less stable** — crypto volume is erratic and exchange-dependent. The 2-year baseline (520 bars) helps smooth this somewhat, but %V readings should still be weighted less heavily than in equities. Use them directionally, not as precise thresholds.
- **%$ and %B are your primary reads** — more reliable signals in crypto since they depend only on price, not volume.
- **Extreme readings are common** — crypto regularly hits 90+ and 10− on %$ and %B across multiple timeframes. With annual-scale settings, a 10X %$ under 20 means price is near the bottom of its 10-year range — a genuinely rare and significant structural condition. Don't fade extremes too early. Wait for 1X to start recovering while 3X and 5X are still low — that's the early turn signal.
- **Timeframe**: Daily chart with %P = 52, %B = 26, %V = 52 works well for longer-hold crypto positions. For shorter swings, consider dropping to %P = 4, %B = 12, %V = 4 on a daily or 4H chart.
- **BTC correlation** — most altcoins move with BTC. Run the matrix on BTC first. If BTC has a high TDF Rating, altcoin setups are higher risk regardless of their individual readings.
- **Best setups**: Post-capitulation recoveries where %$ and %B are extremely low across all timeframes and %V spikes above 50 — the washout + accumulation pattern that precedes big crypto moves. With annual settings, this means price is near multi-year lows with volume starting to recover above the 2-year baseline.

---

## Practical Workflow

| Step | Action |
|------|--------|
| 1 | Check macro — SPY/QQQ and BTC TDF Ratings |
| 2 | Scan watchlist for low TDF Ratings with %V building |
| 3 | Confirm timeframe alignment (1X low + 10X not broken) |
| 4 | Check the state description — Accumulation or Fading Capitulation preferred |
| 5 | Find technical trigger on the chart |
| 6 | Size position based on matrix alignment strength — full alignment = larger position, partial = smaller starter |
| 7 | Monitor — trim when TDF Rating pushes above 70–75 or state shifts to Fading Participation |

*The edge with this indicator is really in steps 2–4 — it helps you avoid buying extended conditions and focus energy on setups where the math says you're buying value, not euphoria.*

---

## Quick Reference — Signal Checklist

### Potential Long Setup
- [ ] TDF Rating under 40
- [ ] %$ low on 3X and 5X (under 30)
- [ ] %B low (under 35)
- [ ] %V above 50 or rising
- [ ] 10X readings not broken (above 20)
- [ ] State = Accumulation or Fading Capitulation
- [ ] Technical trigger identified on chart
- [ ] Macro context not extended (SPY/BTC TDF Rating under 65)

### Caution / Avoid
- [ ] TDF Rating above 75
- [ ] %$ and %B above 80 across multiple timeframes
- [ ] %V fading while price is high
- [ ] State = Fading Participation
- [ ] Earnings within 2 weeks (equities)
- [ ] BTC TDF Rating above 70 (crypto altcoins)

---

*Document generated May 2026. Based on Pine Script v6 indicator "668 TDF Matrix" and TDFLibrary by RMCapital668.*
