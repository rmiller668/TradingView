# RAF Matrix — Reference Guide

> **Disclaimer:** This document is for informational and reference purposes only. Nothing here constitutes financial advice. All trading decisions are your own responsibility.

---

## Overview

**RAF Matrix** is a Pine Script v6 indicator for TradingView that evaluates market conditions through the lens of **risk** — specifically whether risk is being rewarded, accepted, and how demanding it is to hold. It is designed for use on a **monthly chart** with a default base period of 12 bars (≈ 1 year), making it a macro-level, long-term structural tool.

Where the TDF Matrix asks *"where is price in its range?"*, the RAF Matrix asks *"is risk worth taking right now, and is the market accepting it?"* It is a **risk environment assessment tool**, not a price position tool.

The name RAF reflects its three core dimensions: **Rate of Return (Risk Efficiency)**, **Acceptance (Participation)**, and **Friction (Energy)**.

---

## Philosophy

The RAF Matrix is grounded in the same Truth Detection Framework (TDF) principle — *money is not made by time, but by truth*. Applied here, the truth being detected is whether the market is genuinely compensating risk-takers or merely appearing to do so. A price advance without risk efficiency is expensive. Risk accepted broadly across multiple horizons is durable. The matrix surfaces these distinctions systematically.

---

## Horizons

All metrics are evaluated across five columns derived from the `Base Period` input (default: 12). On a monthly chart this maps to:

| Column | Multiplier | Bar Count (default) | Approximate Duration |
|--------|-----------|---------------------|----------------------|
| BASIS  | —         | 1 bar               | Current month        |
| 1X     | 1×        | 12 bars             | 1 year               |
| 3X     | 3×        | 36 bars             | 3 years              |
| 5X     | 5×        | 60 bars             | 5 years              |
| 10X    | 10×       | 120 bars            | 10 years             |

```
lens1x  = basePeriod * 1
lens3x  = basePeriod * 3
lens5x  = basePeriod * 5
lens10x = basePeriod * 10
```

**BASIS** is always the raw current reading. **1X through 10X** are SMAs of the same underlying formula over those horizon lengths — they represent the *average* of that metric across the window, not a single point-to-point comparison.

---

## Metrics

### Risk Efficiency

*Is holding risk being rewarded or penalized over this horizon?*

Measures the average percentage return earned per base period across each horizon. Positive means capital has been compensated for carrying uncertainty. Negative means risk has been penalized.

**BASIS** — raw single-period return from `basePeriod` bars ago to now:
```
rorBase = (close - close[basePeriod]) / close[basePeriod] * 100
```

**1X / 3X / 5X / 10X** — the same per-period return formula, smoothed with an SMA over the horizon length. This gives the *average* per-period return across that window:
```
getAverageRoR(basisLength, smaLength) =>
    ror = (close - close[basisLength]) / close[basisLength] * 100
    ta.sma(ror, smaLength)

ror1x  = getAverageRoR(basePeriod, lens1x)
ror3x  = getAverageRoR(basePeriod, lens3x)
ror5x  = getAverageRoR(basePeriod, lens5x)
ror10x = getAverageRoR(basePeriod, lens10x)
```

**Color scale:** Gradient from `colorLow` (red) to `colorHigh` (teal), mapped over −50% to +50%.

---

### Price Return

*How far has price actually moved over each horizon?*

The raw realized percentage change from the current bar back to each horizon anchor — a single point-to-point comparison, not an average. Independent of risk efficiency or volatility.

```
getPriceReturn(lens) =>
    (close - close[lens]) / close[lens] * 100

priceReturnBase = getPriceReturn(basePeriod)
priceReturn1x   = getPriceReturn(lens1x)
priceReturn3x   = getPriceReturn(lens3x)
priceReturn5x   = getPriceReturn(lens5x)
priceReturn10x  = getPriceReturn(lens10x)
```

**Key distinction from Risk Efficiency:** Price Return is a single lookback comparison. Risk Efficiency is the SMA of that same per-period return averaged across the horizon. Price Return can be high while Risk Efficiency is low if the move was concentrated in a short burst rather than sustained over time. When Price Return is high but Risk Efficiency is low, the move was expensive — volatility-driven, not risk-rewarded.

**Color scale:** Same gradient as Risk Efficiency, −50% to +50%.

---

### Risk Density

*How much return is packed into each dollar of accepted price risk?*

Risk Efficiency divided by the smoothed price level at each horizon. Higher values mean more return per dollar of risk (productive risk). Lower values mean expensive or crowded risk — you're paying more for less return.

**Price Level** (the denominator) is the SMA of `close` over each horizon length:
```
priceBase = close
price1x   = ta.sma(close, lens1x)
price3x   = ta.sma(close, lens3x)
price5x   = ta.sma(close, lens5x)
price10x  = ta.sma(close, lens10x)
```

**Risk Density** is then:
```
riskDensityBase = rorBase  / close
riskDensity1x   = ror1x   / price1x
riskDensity3x   = ror3x   / price3x
riskDensity5x   = ror5x   / price5x
riskDensity10x  = ror10x  / price10x
```

Division is guarded: if the denominator is `na` or `0`, the result is `na`.

**Color scale:** Gradient from `colorLow` to `colorHigh`, mapped over −2 to +2.

---

### RoR Continuity

*Is momentum building or fading as you move across time horizons?*

The ratio of Risk Efficiency between adjacent horizons. Shows whether returns are improving or decaying as you look further out.

```
ratio5x   = ror5x  / ror10x   -- 5X ÷ 10X
ratio3x   = ror3x  / ror5x    -- 3X ÷ 5X
ratio1x   = ror1x  / ror3x    -- 1X ÷ 3X
ratioBase = rorBase / ror1x   -- BASIS ÷ 1X
```

- Ratio > 1 = near-term returns are stronger than longer-term (momentum building)
- Ratio < 1 = near-term returns are weaker than longer-term (momentum fading)
- Ratio < 0 = return has flipped sign — structural breakdown

The 10X column displays `—` — it is the structural baseline with nothing longer to compare against. Division is guarded against zero and `na`.

**Color scale:** Intensity-based using `colorContinuity` (purple), mapped over −1 to +2. Values near or above 1 appear stronger; values below 1 or negative fade toward minimum intensity.

---

### Price Level

*Where is price positioned structurally over each horizon?*

The smoothed price value at each horizon — price state, not price movement. Provides structural context for whether current price is above or below its long-term average.

```
priceBase = close
price1x   = ta.sma(close, lens1x)
price3x   = ta.sma(close, lens3x)
price5x   = ta.sma(close, lens5x)
price10x  = ta.sma(close, lens10x)
```

**Display:** Formatted as currency. Background uses the heading color (no gradient) — this row is structural context, not a scored metric.

---

### Participation

*Is risk being accepted or withdrawn at each horizon?*

How broadly and persistently the market is willing to hold risk. Uses Stochastic %K as a proxy for price position within its recent high/low range — high values indicate broad willingness to hold exposure; low values reflect reluctance or withdrawal.

**BASIS** — raw Stochastic %K over the base period:
```
stochBase = ta.stoch(close, high, low, basePeriod)
```

**1X / 3X / 5X / 10X** — the same Stochastic %K, smoothed with an SMA over the horizon length:
```
getAverageStoch(basisLength, smaLength) =>
    ta.sma(ta.stoch(close, high, low, basisLength), smaLength)

stoch1x  = getAverageStoch(basePeriod, lens1x)
stoch3x  = getAverageStoch(basePeriod, lens3x)
stoch5x  = getAverageStoch(basePeriod, lens5x)
stoch10x = getAverageStoch(basePeriod, lens10x)
```

- ≥ 60 = broad willingness to hold exposure — risk is being accepted
- < 60 = reluctance or withdrawal — participation is thin

**Color scale:** Intensity-based using `colorParticipation` (dark red), mapped 0–100. Higher values produce a stronger (less transparent) color.

---

### Energy

*How demanding is the risk environment to hold?*

The effort required to hold a position, measured as ATR as a percentage of price. Low values indicate calm conditions that are easy to hold. High values reflect expanding uncertainty and increasing difficulty.

**BASIS** — raw ATR/Close % over the base period:
```
energyBase = (ta.atr(basePeriod) / close) * 100
```

**1X / 3X / 5X / 10X** — the same ATR/Close % formula, smoothed with an SMA over the horizon length:
```
getAverageEnergy(basisLength, smaLength) =>
    energy = (ta.atr(basisLength) / close) * 100
    ta.sma(energy, smaLength)

energy1x  = getAverageEnergy(basePeriod, lens1x)
energy3x  = getAverageEnergy(basePeriod, lens3x)
energy5x  = getAverageEnergy(basePeriod, lens5x)
energy10x = getAverageEnergy(basePeriod, lens10x)
```

- ≤ 20 = calm conditions, easy to hold
- > 20 = expanding uncertainty, increasing difficulty and stress

**Color scale:** Intensity-based using `colorEnergy` (dark yellow), mapped 0–100. Higher values (more demanding) produce a stronger color.

---

### Sensitivity

*How fragile is pricing — how strongly will prices react to disappointment?*

Measures where price sits within its Bollinger Band envelope using %B. High values mean price is near the upper band — extended, fragile, sensitive to disappointment. Low values mean price is near the lower band — compressed, potentially forgiving.

**%B formula** (applied at each horizon's basis length):
```
getBBPercentB(basisLength) =>
    basis = ta.sma(close, basisLength)
    dev   = ta.stdev(close, basisLength)
    upper = basis + 2.0 * dev
    lower = basis - 2.0 * dev
    (close - lower) / (upper - lower) * 100
```

**BASIS** — raw %B at the base period length:
```
posBase = getBBPercentB(basePeriod)
```

**1X / 3X / 5X / 10X** — %B smoothed with an SMA over the horizon length:
```
getAveragePosition(basisLength, smaLength) =>
    ta.sma(getBBPercentB(basisLength), smaLength)

pos1x  = getAveragePosition(basePeriod, lens1x)
pos3x  = getAveragePosition(basePeriod, lens3x)
pos5x  = getAveragePosition(basePeriod, lens5x)
pos10x = getAveragePosition(basePeriod, lens10x)
```

**Color scale:** Intensity-based using `colorPosition` (blue), mapped 0–100. Higher values (price near upper band) produce a stronger color.

---

## Visual Layout

A 6×10 table with horizons across columns and metrics down rows:

|                  | 10X | 5X | 3X | 1X | BASIS |
|------------------|-----|----|----|----|----|
| **Risk Efficiency** | ... | .. | .. | .. | .. |
| **Price Return**    | ... | .. | .. | .. | .. |
| **Risk Density**    | ... | .. | .. | .. | .. |
| **Continuity**      | —   | .. | .. | .. | .. |
| **Price Level**     | ... | .. | .. | .. | .. |
| **Participation**   | ... | .. | .. | .. | .. |
| **Energy**          | ... | .. | .. | .. | .. |
| **Sensitivity**     | ... | .. | .. | .. | .. |
| *(Risk State — merged footer row)* |

- **Columns** run from 10X (long-term structural) to BASIS (current)
- **BASIS** is the raw current reading; 1X through 10X are SMAs over those horizon lengths
- The footer row shows the **Risk State** with intensity percentage

---

## Risk States

The footer row synthesizes all metrics into a single state description. The active logic uses `priceReturnBase` as the primary truth signal.

**Risk Intensity** is computed first as a weighted composite of Risk Efficiency and Participation across the 1X, 3X, and 5X horizons. Longer horizons carry more weight:

```
getRiskRating(ror1x, ror3x, ror5x, part1x, part3x, part5x) =>
    -- weights: w1=1, w3=3, w5=5 (sum=9)
    rorWeighted = (ror1x*1 + ror3x*3 + ror5x*5) / 9
    rorClamped  = clamp(rorWeighted, -20, 20)
    rorScore    = (rorClamped + 20) / 40 * 100   -- normalized 0–100
    partScore   = (part1x*1 + part3x*3 + part5x*5) / 9
    riskIntensity = (rorScore + partScore) / 2
```

**Risk State** is then assigned from these boolean flags (evaluated in order):

| Flag | Condition |
|------|-----------|
| `priceAdvancing` | `priceReturnBase > 0` |
| `riskAccepted` | `ror1x > 0` |
| `riskConfirmed` | `ror1x > 0` AND `ror3x > 0` AND `ror5x > 0` |
| `priceLeadingRisk` | `priceAdvancing` AND `ror1x <= 0` |
| `participationHigh` | `stochBase >= 60` |
| `energyCalm` | `energyBase <= 20` |

```
if priceLeadingRisk and not participationHigh  → VOLATILITY-LED MOVE
if not priceAdvancing and not riskAccepted     → RISK REJECTED
if priceAdvancing and not riskAccepted         → RISK UNACCEPTED
if priceAdvancing and riskAccepted
   and not riskConfirmed                       → RISK STABILIZING
if priceAdvancing and riskConfirmed
   and participationHigh and energyCalm        → RISK EXPANDING
if riskConfirmed and participationHigh
   and energyCalm and stochBase >= 80          → RISK CROWDED
else                                           → RISK REALIGNING
```

**State meanings:**

| State | Meaning |
|-------|---------|
| **RISK REJECTED** | Capital has withdrawn. Risk is neither rewarded nor accepted. Avoid new exposure. |
| **RISK STABILIZING** | Participation persists despite absent reward. Conditions are repairing but not confirmed. |
| **RISK UNACCEPTED** | Price is moving but risk efficiency is negative and sponsorship is lacking. Expensive move. |
| **VOLATILITY-LED MOVE** | Price has advanced without risk acceptance — expensive, volatility-driven, fragile. |
| **RISK EXPANDING** | Risk is rewarded, accepted, and confirmed across regimes. Durable participation. Favorable environment. |
| **RISK IN TRANSITION** | Risk remains accepted but reward persistence is weakening. Conditions becoming fragile. |
| **RISK CROWDED** | Risk acceptance is elevated in calm conditions. Sensitivity to disappointment is high. |
| **RISK REALIGNING** | Default state when conditions don't fit a clear pattern. Price and efficiency are adjusting. |

**Risk Intensity** percentage (0–100) accompanies each state:

| Intensity | Meaning |
|-----------|---------|
| < 15% | Risk expression is minimal and participation is scarce |
| 15–35% | Risk acceptance is emerging but remains limited |
| 35–55% | Risk is increasingly accepted across horizons |
| 55–70% | Risk acceptance is broad and conditions are mature |
| 70–85% | Risk participation is elevated and becoming fragile |
| > 85% | Risk is crowded with rising imbalance and sensitivity |

---

## Inputs / Settings

| Input | Default | Description |
|-------|---------|-------------|
| Base Period | 12 | Base period in bars. On a monthly chart, 12 ≈ 1 year. Horizons are 1x, 3x, 5x, 10x multiples. |
| Table X | center | Horizontal table position |
| Table Y | middle | Vertical table position |
| Table W | 100 | Table width as % of panel |
| Table H | 100 | Table height as % of panel |
| Low Performance | Red | Gradient color for low/negative readings |
| High Performance | Teal | Gradient color for high/positive readings |
| RoR Continuity | Purple | Color for the Continuity row |
| Participation | Dark Red | Color for the Participation row |
| Breadth/Energy | Dark Yellow | Color for the Energy row |
| Position/Sensitivity | Blue | Color for the Sensitivity row |
| Headings | Gray | Background color for row/column labels |
| Text | White | Text color |

---

## How to Use the RAF Matrix

### Recommended Timeframe
Monthly chart with base period of 12. This makes each horizon meaningful:
- **BASIS** = current month
- **1X** = 1-year average
- **3X** = 3-year average
- **5X** = 5-year average
- **10X** = 10-year structural baseline

### Reading the Matrix — Column by Column

Start from the right (BASIS) and read left. The right side tells you what's happening now; the left side tells you whether it's structurally supported.

- **BASIS column** = current truth. Is risk being rewarded right now?
- **1X column** = recent confirmation. Has this been consistent over the past year?
- **3X–10X columns** = structural context. Is this a short-term condition or a long-term regime?

### The Key Relationship: Risk Efficiency vs. Price Return

This is the most important comparison in the matrix. Read these two rows together:

| Condition | Interpretation |
|-----------|---------------|
| Risk Efficiency positive AND Price Return positive | Healthy advance — risk is being rewarded for the move |
| Price Return positive, Risk Efficiency negative | Expensive move — price led without risk compensation. Volatility-driven, fragile. |
| Risk Efficiency positive, Price Return flat/negative | Risk is being rewarded despite price compression — potential coiling before a move |
| Both negative | Risk rejected — avoid new exposure |

### Reading Continuity

The Continuity row shows whether momentum is building or fading across horizons:

- **Ratios > 1 cascading from 10X to BASIS** = momentum building — near-term returns are outpacing long-term averages
- **Ratios < 1 or declining** = momentum fading — near-term returns are weakening relative to structure
- **Negative ratios** = return has flipped — structural breakdown in progress

### Participation + Energy Together

These two rows reveal the quality of the risk environment:

| Participation | Energy | Interpretation |
|---------------|--------|---------------|
| High | Low | Ideal — broad acceptance in calm conditions. RISK EXPANDING territory. |
| High | High | Crowded and demanding — risk is accepted but costly to hold. Fragile. |
| Low | Low | Quiet withdrawal — risk is being avoided without stress. Potential base building. |
| Low | High | Stressed rejection — forced selling or capitulation environment. |

---

## Practical Workflow

| Step | Action |
|------|--------|
| 1 | Check the Risk State footer — what regime are you in? |
| 2 | Compare Risk Efficiency and Price Return — is the move rewarded or expensive? |
| 3 | Check Continuity — is momentum building (ratios > 1) or fading? |
| 4 | Check Participation across horizons — is acceptance broad or thin? |
| 5 | Check Energy — is the environment calm enough to hold? |
| 6 | Use the RAF Matrix as macro context before applying the TDF Matrix to individual names |

---

## RAF Matrix vs. TDF Matrix

These two indicators are complementary, not redundant. Use them together:

| | TDF Matrix | RAF Matrix |
|---|---|---|
| **Question** | Where is price in its range? | Is risk worth taking? |
| **Timeframe** | Daily / Weekly | Monthly |
| **Primary use** | Individual stock setup identification | Macro risk environment assessment |
| **Key output** | TDF Rating (0–100) | Risk State + Intensity |
| **Entry signal** | Low TDF Rating with %V building | RISK EXPANDING or RISK STABILIZING state |
| **Caution signal** | TDF Rating > 75 | RISK CROWDED or RISK IN TRANSITION |

**Workflow integration:**
1. Check RAF Matrix on the monthly chart — confirm the macro risk environment is favorable (RISK EXPANDING or STABILIZING, not CROWDED or REJECTED)
2. Drop to daily/weekly and use TDF Matrix to find individual setups with low ratings and building volume
3. Only take setups where both tools are aligned

---

## Quick Reference — Signal Checklist

### Favorable Environment (RAF Matrix)
- [ ] Risk State: RISK EXPANDING or RISK STABILIZING
- [ ] Risk Efficiency positive at BASIS and 1X
- [ ] Price Return and Risk Efficiency moving together (not diverging)
- [ ] Continuity ratios ≥ 1 at 1X and 3X
- [ ] Participation ≥ 60 at 1X
- [ ] Energy low (≤ 20) — calm conditions

### Caution / Reduce Exposure (RAF Matrix)
- [ ] Risk State: RISK CROWDED or RISK IN TRANSITION
- [ ] Price Return significantly higher than Risk Efficiency (expensive move)
- [ ] Continuity ratios declining or turning negative
- [ ] Participation high but Energy also high — crowded and demanding
- [ ] Risk Intensity > 70%

### Avoid / Exit (RAF Matrix)
- [ ] Risk State: RISK REJECTED
- [ ] Risk Efficiency negative across multiple horizons
- [ ] Participation collapsing while Energy is rising

---

*Document generated May 2026. Based on Pine Script v6 indicator "RAF Matrix" by RMCapital668.*
