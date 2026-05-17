# RoR Efficiency — Reference Guide

> **Disclaimer:** This document is for informational and reference purposes only. Nothing here constitutes financial advice. All trading decisions are your own responsibility.

---

## Overview

**RoR Efficiency** is a Pine Script v6 lower-panel indicator for TradingView that measures whether holding an asset is being rewarded, and whether that reward is improving or deteriorating across short and long-term regimes.

It is a focused, single-metric companion to the RAF Matrix's Risk Efficiency row — stripped down to a real-time momentum view of rate of return. Where the RAF Matrix gives you a multi-horizon structural snapshot, this indicator shows you whether that efficiency is building or breaking down bar by bar.

---

## What It Measures

The indicator calculates one core value:

```
Basis RoR = (close - close[basis periods ago]) / close[basis periods ago] * 100
```

This is the raw rolling percentage return earned since N bars ago — the truth of whether holding this asset has been rewarded over the lookback period.

From that single calculation it derives three views:

| Plot | Description |
|---|---|
| **Basis RoR** (gray line) | Raw rolling return. No smoothing. What actually happened. |
| **Fast RoR** (teal line) | Short-term SMA of the basis return. Captures the immediate regime. |
| **Slow RoR** (white line) | Longer-term SMA of the basis return. Captures the sustained regime. |
| **RoR Spread** (histogram) | Fast minus Slow. Green = fast outpacing slow (momentum building). Red = fast lagging slow (momentum fading). |

A status table displays BASIS, FAST, and SLOW values color-coded green/red/neutral at a glance.

---

## How to Read It

This is a **momentum quality indicator**, not a price position indicator. It answers the question: *"How is the market currently compensating risk exposure, and is that compensation improving or deteriorating across regimes?"*

| Condition | Interpretation |
|---|---|
| All three lines positive and rising | Risk is being rewarded and improving — favorable |
| Fast above Slow, both positive | Momentum building — early stage of a rewarded move |
| Fast crossing below Slow | Momentum fading — reward deteriorating even if still positive |
| Basis positive but Fast/Slow negative | Recent return positive but trend of returns declining — warning |
| All three negative | Risk is being penalized — avoid or exit |
| Histogram green and growing | Acceleration — short-term return outpacing long-term average |
| Histogram red and deepening | Deceleration — short-term return falling behind long-term average |

---

## Where It Fits in the Framework

This indicator is the lower-panel companion to the RAF Matrix's Risk Efficiency row. Used together on the same chart:

- **RAF Matrix** tells you the regime across multiple structural horizons
- **RoR Efficiency** tells you whether that regime is strengthening or weakening right now

On a monthly chart it directly mirrors the RAF Matrix's Risk Efficiency row. On a weekly or daily chart it provides a more granular read of the same concept at a shorter timeframe.

---

## Understanding Settings — Momentum vs. Regime

The three inputs — Basis, Fast, and Slow — work together to define what question the indicator is answering. Changing them doesn't just change sensitivity; it changes the fundamental nature of what you're reading.

**Basis** defines the measurement window. It determines how far back you look to calculate each bar's return. A longer basis captures more structural history; a shorter basis is more reactive to recent price movement.

**Fast** smooths the basis return over a short window. A fast period equal to one quarter captures intra-year momentum shifts. A fast period equal to one year turns it into a sustained regime measure.

**The Fast/Slow ratio** is the most important relationship. A tight ratio (e.g., 3/12 = 1:4) creates meaningful separation between the two lines, making crossovers and histogram behavior informative. A wide ratio (e.g., 12/36 = 1:3) creates a slower, more structural comparison. A ratio near 1:1 (e.g., 12/12) collapses the two lines together and eliminates the spread — avoid this.

**Three modes of use:**

- **Momentum mode** — Fast is short relative to Slow (ratio of 1:4 or tighter). The histogram is reactive and crossovers are frequent enough to be actionable. You're reading the near-term pulse of return efficiency — whether conditions are improving or deteriorating right now. Best used for timing entries and exits within an established regime. Signals should be confirmed by the broader context before acting.

- **Intermediate mode** — Fast and Slow sit between the momentum and regime extremes (ratio of roughly 1:3 to 1:4, but with longer absolute values). The histogram moves at a measured pace — not reactive enough for tactical timing, not slow enough to be purely structural. You're reading whether the medium-term return environment is better or worse than a multi-year average. Best used when momentum configurations are too noisy on a volatile asset, or when you want a secondary confirmation layer between the tactical and structural views.

- **Regime mode** — Fast and Slow are both long, with wide absolute separation (ratio of 1:3 or wider, both values large). The histogram moves slowly and crossovers are rare. When a crossover does occur, it represents a genuine structural shift that has been sustained long enough to move a long-term average. You're not timing anything — you're confirming whether the asset is in a structurally rewarding or structurally penalizing environment. Best used as a macro filter alongside the RAF Matrix.

---

### Quarterly Chart

On a quarterly chart, each bar represents three months. The natural cycle anchor is 4 bars = 1 year. Decade-scale structural trends are visible here — this is the slowest, most structural timeframe.

**Momentum Configuration: 4, 2, 4**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 4 | 1-year rolling return — the annual cycle is your measurement unit |
| Fast | 2 | 6-month average of the 1-year return — catches mid-year regime shifts |
| Slow | 4 | 1-year average of the 1-year return — confirms whether the shift is sustained |

The histogram (Fast − Slow) answers: *is the first half of the year's return better or worse than the full year's average?* Crossovers signal that the annual return trend is changing direction within the year. This is the most responsive configuration available on a quarterly chart. Even so, signals are slow by nature — a crossover here represents a meaningful multi-quarter shift, not a short-term fluctuation.

**Regime Configuration: 4, 4, 12**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 4 | 1-year rolling return |
| Fast | 4 | 1-year average of the 1-year return |
| Slow | 12 | 3-year average of the 1-year return |

The histogram answers: *is the current annual return better or worse than the 3-year structural average?* Crossovers are rare — they signal genuine decade-scale regime changes. Green histogram means the current year is outperforming the 3-year norm. Red means it's underperforming. Use this configuration when you want to understand whether an asset is in a structurally improving or deteriorating long-term cycle.

---

### Monthly Chart

On a monthly chart, each bar represents one month. The natural cycle anchor is 12 bars = 1 year. This is the primary timeframe for the RAF Matrix and the most versatile for this indicator.

**Momentum Configuration: 12, 3, 12**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 12 | 1-year rolling return — the annual cycle is your measurement unit |
| Fast | 3 | Quarterly average of the 1-year return — catches quarterly momentum shifts |
| Slow | 12 | Annual average of the 1-year return — confirms whether the shift is sustained |

The histogram answers: *is the quarterly momentum of annual returns building or fading?* This is the recommended default. It aligns directly with the RAF Matrix's 1x and 3x horizon comparison. Fast crosses above Slow when the most recent quarter's return environment is outpacing the full-year average — an early signal that conditions are improving. Fast crosses below Slow when the quarterly return is lagging the annual average — a warning that momentum is fading even if the annual return is still positive.

This is the most actionable configuration on a monthly chart. Crossovers are meaningful but not so frequent as to be noisy.

**Intermediate Configuration: 12, 6, 24**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 12 | 1-year rolling return |
| Fast | 6 | 6-month average — sits between quarterly momentum and annual regime |
| Slow | 24 | 2-year average — intermediate structural baseline |

The histogram answers: *is the semi-annual return environment better or worse than the 2-year average?* This sits between momentum and regime — more responsive than 12/36 but more structural than 3/12. Useful when you want to reduce noise from the momentum configuration without committing to the full regime view. A good choice when the 3/12 configuration is generating too many crossovers on a volatile asset.

**Regime Configuration: 12, 12, 36**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 12 | 1-year rolling return |
| Fast | 12 | 1-year average of the 1-year return |
| Slow | 36 | 3-year average of the 1-year return |

The histogram answers: *is the current annual return better or worse than the 3-year structural average?* Both lines are heavily smoothed — they move slowly and crossovers are infrequent. When Fast crosses above Slow here, it means the current year's return has been consistently better than the 3-year norm for long enough to shift the average. That's a significant structural statement. Use this configuration alongside the RAF Matrix when you want to confirm that a regime change is structural, not just a short-term fluctuation.

---

### Weekly Chart

On a weekly chart, each bar represents one week. The natural cycle anchor is 52 bars = 1 year. This timeframe bridges the macro context of the monthly RAF Matrix and the tactical context of daily price action.

**Short-term Momentum Configuration: 26, 4, 13**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 26 | 6-month rolling return — shorter cycle, more reactive |
| Fast | 4 | Monthly average (4 weeks) of the 6-month return — catches monthly momentum shifts |
| Slow | 13 | Quarterly average of the 6-month return — confirms whether the monthly shift is sustained |

The histogram answers: *is the monthly momentum of 6-month returns building or fading?* This is a more tactical configuration — appropriate when you're using the weekly chart for shorter swing trades (days to weeks) rather than longer-term holds. The 26-week basis aligns with the TDF Matrix's standard weekly settings (26, 12, 26). Crossovers are more frequent and should be read in context with the TDF Rating rather than in isolation.

**Momentum Configuration: 52, 13, 52**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 52 | 1-year rolling return — matches TDF Matrix %P/%V basis of 52 |
| Fast | 13 | Quarterly average (13 weeks) of the 1-year return — catches quarterly momentum shifts |
| Slow | 52 | Annual average of the 1-year return — confirms whether the shift is sustained |

The histogram answers: *is the quarterly momentum of annual returns building or fading on a weekly basis?* This maintains the same 1:4 fast/slow ratio as the monthly 3/12 configuration, keeping interpretation consistent across timeframes. Crossovers here are more frequent than on the monthly chart but still meaningful — they represent genuine quarterly-level shifts in return momentum, not weekly noise. This is the recommended default for weekly charts and aligns with the TDF Matrix's 52-week basis settings.

**Regime Configuration: 52, 52, 156**

| Setting | Value | Meaning |
|---|---|---|
| Basis | 52 | 1-year rolling return |
| Fast | 52 | 1-year average of the 1-year return |
| Slow | 156 | 3-year average of the 1-year return |

The histogram answers: *is the current annual return better or worse than the 3-year structural average, measured weekly?* This is the weekly equivalent of the monthly 12/12/36 configuration. Crossovers are rare and represent structural regime changes. The weekly granularity means you can see the exact week the regime shifted, even though the signal itself is slow-moving. Useful for confirming that a long-term trend change identified on the monthly chart is also visible at the weekly level.

---

## Settings Reference Summary

| Timeframe | Mode | Basis | Fast | Slow | Question Being Asked |
|---|---|---|---|---|---|
| Quarterly | Momentum | 4 | 2 | 4 | Is the first half of the year outpacing the full year? |
| Quarterly | Regime | 4 | 4 | 12 | Is the current year better than the 3-year average? |
| Monthly | Momentum | 12 | 3 | 12 | Is quarterly momentum of annual returns building or fading? |
| Monthly | Intermediate | 12 | 6 | 24 | Is the semi-annual return better than the 2-year average? |
| Monthly | Regime | 12 | 12 | 36 | Is the current year better than the 3-year structural average? |
| Weekly | Short Momentum | 26 | 4 | 13 | Is monthly momentum of 6-month returns building or fading? |
| Weekly | Momentum | 52 | 13 | 52 | Is quarterly momentum of annual returns building or fading? |
| Weekly | Regime | 52 | 52 | 156 | Is the current year better than the 3-year structural average? |

---

*Last updated: May 2026. Based on Pine Script v6 indicator "Rate of Return (%)" by RMCapital668.*

---

## Multi-Timeframe Configurations

### Why TDF Matrix and RoR Efficiency Settings Differ

The TDF Matrix and RoR Efficiency serve different purposes, which is why their settings are not identical even when used on the same chart.

**TDF Matrix** measures where price, volatility, and volume are in their cycles — it's a position indicator. Its settings are about **cycle coherence**. All three metrics need to be measuring the same structural timeframe (with %B intentionally shorter at a 2:1 ratio to %P) so that when they align, you're reading a genuine multi-dimensional structural condition, not three metrics on different clocks.

**RoR Efficiency** measures whether return efficiency is structurally improving or deteriorating — it's a momentum quality indicator. Its settings are about **confirmation depth**. In regime mode, the Fast line is deliberately long because for longer-term investing a false signal is more costly than a late one. In momentum mode, the Fast line is short to catch intra-cycle shifts early.

---

### Long-Term Investing — Monthly + Weekly

For longer-term holds (weeks to months), the clock is anchored to annual cycles.

| Chart | Indicator | Settings | Role |
|---|---|---|---|
| Monthly | RAF Matrix | Basis 12 | Macro permission layer — is the risk environment rewarding? |
| Monthly | RoR Efficiency | 12, 12, 36 (Regime) | Is the current year structurally better than the 3-year average? |
| Weekly | TDF Matrix | 52, 26, 52 | Cycle position — is the asset at an annual cycle low? |
| Weekly | RoR Efficiency | 52, 52, 156 (Regime) | Structural confirmation — is annual return efficiency above its 3-year norm? |
| Weekly | RoR Efficiency | 52, 13, 52 (Momentum) | Timing layer — is the quarterly pulse within the regime accelerating? |

**TDF Matrix 52/26/52 rationale:** %P = 52 anchors price range to a full year. %B = 26 maintains the 2:1 ratio, keeping Bollinger position more responsive than raw range. %V = 52 matches %P so volume is measured against the same annual baseline as price.

**RoR Efficiency 52/52/156 rationale:** Basis = 52 measures annual rolling return. Fast = 52 confirms the annual return has been consistently positive — not reactive to quarterly fluctuations. Slow = 156 is the 3-year structural baseline. The spread answers: is the current year outperforming the 3-year average?

**Entry checklist (long-term):**
- Monthly RAF State: RISK EXPANDING or RISK STABILIZING
- Monthly RoR Efficiency: Fast above Slow, histogram green and holding
- Weekly TDF Rating: 20–40 range, rising
- Weekly %P: low on 3X and 5X (under 30)
- Weekly %B: low — not chasing
- Weekly %V: above 50 or rising
- Weekly RoR Efficiency (Regime): Fast above Slow
- Weekly RoR Efficiency (Momentum): histogram turning green — quarterly pulse accelerating

---

### Short-Term Swing Trading — Weekly + Daily

For swing trades (days to weeks), the clock drops to monthly cycles. The weekly chart becomes the structural context layer and the daily chart becomes the entry timing layer.

| Chart | Indicator | Settings | Role |
|---|---|---|---|
| Weekly | TDF Matrix | 26, 12, 26 | Structural setup — is the asset at a half-year cycle low? |
| Weekly | RoR Efficiency | 26, 4, 13 (Momentum) | Momentum context — is quarterly return efficiency building? |
| Daily | TDF Matrix | 20, 10, 20 | Entry timing — is the daily cycle compressed and turning? |
| Daily | RoR Efficiency | 20, 5, 20 (Momentum) | Entry pulse — is weekly return momentum accelerating? |

**TDF Matrix 26/12/26 rationale:** %P = 26 measures a 6-month price range — the right structural window for a swing trade. %B = 12 maintains the 2:1 ratio. %V = 26 matches %P.

**TDF Matrix 20/10/20 rationale:** On a daily chart, 20 bars ≈ 1 trading month. %P = 20 measures monthly range position. %B = 10 (2:1 ratio) catches Bollinger compression before a move. %V = 20 matches %P.

**RoR Efficiency 26/4/13 rationale:** Basis = 26 measures 6-month rolling return. Fast = 4 (one month) catches monthly shifts in return efficiency. Slow = 13 (one quarter) confirms whether the monthly shift is sustained.

**RoR Efficiency 20/5/20 rationale:** Basis = 20 measures monthly rolling return. Fast = 5 (one trading week) catches weekly momentum shifts. Slow = 20 matches the basis — asking whether the weekly pulse of monthly returns is building or fading.

**Entry logic (swing trades):**

Weekly must show:
- TDF Rating in the 25–45 range
- %P low on 3X column (under 35) — half-year pullback
- %B low — not chasing
- %V at or above 50 or rising
- RoR Efficiency Fast crossing above Slow or already above

Daily must show:
- TDF Rating turning up from a low — needs to be recovering, not necessarily at a low
- %P recovering from under 30 at 1X and 3X
- %V above 50 — participation present on the shorter cycle
- RoR Efficiency histogram turning green — weekly return pulse accelerating

**The sequence matters:** Weekly sets the thesis, daily provides the trigger. Never enter on a daily signal alone without weekly structural support.

---

### Complete Configuration Reference

| Style | Chart | Indicator | Settings | Mode |
|---|---|---|---|---|
| Long-term | Monthly | RAF Matrix | Basis 12 | — |
| Long-term | Monthly | RoR Efficiency | 12, 12, 36 | Regime |
| Long-term | Weekly | TDF Matrix | 52, 26, 52 | — |
| Long-term | Weekly | RoR Efficiency | 52, 52, 156 | Regime |
| Long-term | Weekly | RoR Efficiency | 52, 13, 52 | Momentum |
| Swing | Weekly | TDF Matrix | 26, 12, 26 | — |
| Swing | Weekly | RoR Efficiency | 26, 4, 13 | Momentum |
| Swing | Daily | TDF Matrix | 20, 10, 20 | — |
| Swing | Daily | RoR Efficiency | 20, 5, 20 | Momentum |
