# Technical Ratings Thesis

> *"Money is not made by time, but by truth."*

> **Disclaimer:** This document is for informational and reference purposes only. Nothing here constitutes financial advice. All trading decisions are your own responsibility.

---

## What the Rating Actually Measures

The Technical Ratings system is a composite of 26 constituent indicators — 15 moving averages and 11 oscillators. Each indicator votes -1 (Sell), 0 (Neutral), or +1 (Buy) on every bar. The votes are averaged into a score between -1 and +1.

**Rating categories by score:**

| Score | Category |
|---|---|
| Above 0.5 | Strong Buy |
| 0.1 to 0.5 | Buy |
| -0.1 to 0.1 | Neutral |
| -0.5 to -0.1 | Sell |
| Below -0.5 | Strong Sell |

In the 668 Rating Matrix, the combined mode blends the MA rating and oscillator rating at a configurable weight (default 50/50). The result is a single score per timeframe that reflects the aggregate technical condition of the instrument at that horizon.

---

## The Two Sides of the Rating

Understanding what moves the rating requires understanding that the MA side and the oscillator side behave very differently.

### Moving Average Side (15 indicators)

The 15 MAs are: SMA 10/20/30/50/100/200, EMA 10/20/30/50/100/200, Hull MA 9, VWMA 20, and Ichimoku Cloud.

Every plain MA votes Buy when **price is above the MA value**. The Ichimoku Cloud requires all four structural conditions to align simultaneously.

The MA side is a **trend-following measure**. It accumulates Buy votes gradually as price climbs above progressively longer averages. It is slow to turn and slow to recover. A rating that is being held down primarily by MA votes means price has been below its averages for an extended period — the structure is genuinely broken, not just temporarily weak.

### Oscillator Side (11 indicators)

The 11 oscillators are: RSI (14), Stochastic (14,3,3), CCI (20), ADX (14,14), Awesome Oscillator, Momentum (10), MACD (12,26,9), Stochastic RSI (3,3,14,14), Williams %R (14), Bull Bear Power (13), and Ultimate Oscillator (7,14,28).

Most oscillators require the instrument to be in an **extreme zone and turning** before they vote Buy. RSI must be below 30 and rising. Stochastic must be below 20 with %K crossing above %D. Williams %R must be below -80 and rising. CCI must be below -100 and rising.

The oscillator side is a **mean-reversion measure**. It fires most aggressively at the end of declines, when extreme readings have accumulated. This is the opposite behavior from the MA side — oscillators are primed by weakness, not by strength.

**Key insight:** A prolonged decline loads the oscillator side. The moment price stabilizes and begins turning, multiple oscillators can fire simultaneously, causing the rating to lift quickly from Sell toward Neutral or Buy — even while the MA side is still deeply negative.

---

## Reading the Rating Across Timeframes

The 668 Rating Matrix displays four timeframes for each instrument: Daily, Weekly, Monthly, and Quarterly. Each timeframe is an independent calculation using the same 26 indicators applied to that timeframe's bars.

Reading the four timeframes together tells a structural story that no single timeframe can tell alone.

### Timeframe Hierarchy

| Timeframe | What it reflects | Speed of change |
|---|---|---|
| Daily | Immediate price behavior and short-term momentum | Fast |
| Weekly | Intermediate trend and cycle position | Moderate |
| Monthly | Structural trend and macro condition | Slow |
| Quarterly | Long-horizon regime and secular trend | Very slow |

Higher timeframes carry more weight. A monthly Sell rating means the instrument has been below most of its monthly MAs for an extended period — that is a structural statement, not a temporary condition. A daily Sell rating in the context of a monthly Buy rating is a pullback. The same daily Sell rating in the context of a monthly Sell rating is continuation.

---

## Conditions by Market Situation

### Situation 1 — Pullback Within an Uptrend

The higher timeframes are intact. The lower timeframes have weakened temporarily.

**Typical rating structure:**

| Timeframe | Rating |
|---|---|
| Quarterly | Buy or Strong Buy |
| Monthly | Buy or Neutral |
| Weekly | Sell or Neutral, stabilizing |
| Daily | Sell, beginning to turn |

**What is happening:** The quarterly and monthly MA votes are still positive — price remains above most long-horizon averages. The weekly and daily oscillators have entered oversold territory during the pullback and are now eligible to fire. The MA votes on the daily and weekly are temporarily negative as price dipped below shorter averages.

**The signal:** Daily rating crosses from Sell to Neutral or Buy as oscillators fire and price recrosses the shorter daily MAs (10, 20 EMA/SMA). Weekly rating begins lifting but has not yet confirmed.

**Confirmation:** Weekly rating crosses into Neutral or Buy. This means the weekly oscillators have fired and price has begun recrossing shorter weekly MAs. The pullback is over at the intermediate level.

**What to avoid:** Entering on the daily turn alone when the weekly is still actively falling — not just depressed, but deteriorating. A daily recovery while the weekly continues to decline suggests the pullback is not yet complete.

---

### Situation 2 — Full Structural Downtrend, Seeking the Bottom

All four timeframes are in Sell. The instrument has been declining across all horizons. At some point, buyers return. The rating structure tells you where in that process you are.

**The bottoming sequence unfolds in stages:**

#### Stage 1 — Deep Downtrend (All Sell)

All 26 indicators across all timeframes are voting Sell or Neutral. MA votes are deeply negative — price is below most averages at every horizon. Oscillator votes are also negative — the decline has been sustained enough that oscillators have not yet reached extreme zones, or they reached extreme zones and bounced without holding.

This is full risk rejection. There is no structural signal yet.

#### Stage 2 — Oscillators Loading on Longer Timeframes

The monthly and quarterly ratings are still Sell, but the rate of deterioration is slowing. The monthly RSI has dropped below 30. Monthly Stochastic is below 20. Monthly CCI is below -100. These oscillators are now eligible to vote Buy on any uptick — they are loaded but have not yet fired.

The rating number may not change significantly, but the composition is shifting. Fewer oscillators are voting Sell. More are going neutral. The MA votes are still dragging the score down.

**Observable signal:** Monthly rating stops falling and begins to flatten while price is still down or consolidating. This is the first structural hint — the oscillator side of the monthly is no longer adding to the decline.

#### Stage 3 — Daily and Weekly Turn

Daily crosses from Sell to Neutral or Buy. Weekly begins lifting from its lows. Monthly is still Sell but no longer deteriorating.

This is the earliest actionable signal for a long position. The daily and weekly oscillators have fired. Price is stabilizing. The monthly and quarterly are still negative but the rate of deterioration has stopped.

**The critical test:** Does the weekly hold its recovery? A genuine bottom gives the weekly oscillators time to load, fire, and hold — the weekly rating recovers and stays recovered even if price consolidates sideways. A false bottom (dead-cat bounce) loads the daily oscillators but does not give the weekly enough time to load and fire. The weekly rating lifts briefly and then resumes falling.

#### Stage 4 — Weekly Crosses into Neutral or Buy

The weekly oscillators have fired and price has begun recrossing shorter weekly MAs. Monthly is still Sell or transitioning to Neutral. This is the first genuine intermediate structural signal — risk is beginning to be accepted at the weekly horizon even though the macro structure has not confirmed.

This is the highest-conviction early entry point in a structural recovery. The weekly confirmation means the intermediate oscillators have genuinely fired, not just twitched.

#### Stage 5 — Monthly Crosses into Neutral

Monthly oscillators have fired and some shorter monthly MAs are recrossing. Quarterly is still Sell. This confirms the structural downtrend is losing momentum. The instrument is in repair, not yet in agreement.

#### Stage 6 — Monthly and Quarterly Reach Buy

By this point, a significant portion of the recovery has already occurred. The MA votes on the monthly and quarterly are turning positive as price has been above the shorter averages long enough for them to recross. This is confirmation of a new structural uptrend, not an entry signal.

**Summary table:**

| Stage | Daily | Weekly | Monthly | Quarterly | Meaning |
|---|---|---|---|---|---|
| Deep downtrend | Sell | Sell | Sell | Sell | Full rejection |
| Oscillators loading | Sell/Neutral | Sell | Sell (flattening) | Sell (flattening) | Extreme zones reached |
| First turn | Buy | Neutral | Sell | Sell | Daily recovery, structure still down |
| Intermediate turn | Buy | Buy | Neutral | Sell | Risk accepted at intermediate level |
| Structural repair | Buy | Buy | Buy | Neutral | Monthly confirmed, quarterly lagging |
| Full confirmation | Buy | Buy | Buy | Buy | Most of the move is done |

---

### Situation 3 — Extended Uptrend, Assessing Risk

All four timeframes are in Buy or Strong Buy. The instrument has been advancing across all horizons. The rating structure here is not a signal to act — it is a signal to assess carry cost.

When the quarterly and monthly are in Strong Buy, the MA votes are deeply positive — price is well above most long-horizon averages. The oscillator votes are mixed: momentum oscillators (MACD, Momentum, AO) are likely positive, but mean-reversion oscillators (RSI, Stochastic, Williams %R) may be neutral or negative because they are in overbought territory and not eligible to vote Buy.

**What this means in risk terms:** The rating is high because the MA side is fully positive. But the oscillator side is being held back by overbought readings. The instrument is extended. New buyers are paying a premium. Carry cost is elevated.

A Strong Buy rating across all timeframes is not a reason to add exposure — it is a reason to assess whether the reward for holding is still proportionate to the risk of being wrong.

**The deterioration signal:** When the daily rating begins falling from Strong Buy toward Buy or Neutral while the weekly is still elevated, the daily oscillators are beginning to roll over from overbought. This is the first sign that the short-term reward is fading. If the weekly follows, the intermediate structure is beginning to tire.

---

### Situation 4 — Timeframe Divergence

The most informative rating structures are those where the timeframes disagree. Divergence between timeframes signals a transition — either a recovery building from the bottom up, or a deterioration spreading from the top down.

**Bullish divergence (recovery building):**
- Daily: Buy or Neutral
- Weekly: Sell or Neutral
- Monthly: Sell
- Quarterly: Sell

The lower timeframes are recovering before the higher timeframes confirm. This is the early-stage bottoming pattern. The question is whether the recovery propagates upward through the timeframes or stalls.

**Bearish divergence (deterioration spreading):**
- Daily: Sell or Neutral
- Weekly: Sell or Neutral
- Monthly: Buy
- Quarterly: Buy

The lower timeframes are weakening while the higher timeframes are still positive. This is the early-stage topping or pullback pattern. The question is whether the weakness is a temporary pullback or the beginning of a structural breakdown.

**The propagation test:** In both cases, watch whether the divergence resolves in the direction of the lower timeframes (the leading signal) or the higher timeframes (the structural anchor). If the daily and weekly recover and the monthly holds, the higher timeframe structure wins — it was a pullback. If the daily and weekly continue to deteriorate and the monthly begins to follow, the lower timeframes were leading — it is a structural breakdown.

---

## Integration with the RAF/TDF Framework

The Technical Ratings are a different instrument than the RAF Matrix and TDF Matrix, but they can be read alongside them to add a layer of confirmation.

**Ratings confirm what RAF and TDF identify:**

- The RAF Matrix identifies whether the macro risk environment is rewarding, accepted, and how demanding it is to hold. It answers the permission question.
- The TDF Matrix identifies where an individual asset sits in its price, volatility, and volume cycle. It answers the cycle position question.
- The Technical Ratings confirm whether the market's own composite of trend and momentum indicators agrees with the structural read.

**The highest-conviction configuration:**

| Layer | Condition |
|---|---|
| Monthly RAF Matrix | RISK EXPANDING or transitioning from RISK STABILIZING |
| Weekly TDF Matrix | Low TDF Rating, %V building |
| Monthly/Quarterly Rating | Neutral or Buy (structure not broken at macro level) |
| Weekly Rating | Sell or Neutral, beginning to turn |
| Daily Rating | Crossing from Sell to Neutral or Buy |

All three systems pointing in the same direction — macro permission granted, cycle position at value, ratings beginning to recover — is the configuration this workspace is designed to find.

**When ratings conflict with RAF/TDF:**

If the daily and weekly ratings are recovering but the monthly RAF Matrix is in RISK REJECTED, the ratings are showing a technical bounce inside a hostile macro environment. The RAF permission layer takes precedence. A technical bounce in a rejected risk environment is not a long setup — it is a temporary relief rally inside a downtrend.

If the monthly RAF Matrix is in RISK EXPANDING but the monthly and quarterly ratings are in Sell, the macro environment is supportive but this specific instrument has not yet participated. This is the laggard setup — the instrument is cheap in a healthy environment. The ratings will confirm later; the RAF and TDF identify the opportunity earlier.

---

## Key Principles

**Ratings confirm, they do not lead.** The rating reaches Buy after price has already crossed above multiple MAs and oscillators have already fired. By the time the monthly rating reaches Buy, the move is underway. Use the rating structure to understand where you are in the process, not to time the entry.

**Oscillators are primed by weakness.** A prolonged decline is not just bad news — it is loading the oscillator side of the rating for a rapid recovery. The deeper and longer the decline, the more oscillators are in extreme zones, and the more aggressively the rating can recover when price stabilizes.

**The MA side tells you the structural truth.** If the monthly and quarterly MA votes are deeply negative, the instrument has been below its long-horizon averages for an extended period. That is a structural statement. Oscillators can fire and the daily/weekly ratings can recover, but the monthly and quarterly MA votes will lag until price has genuinely reclaimed those averages.

**Timeframe alignment is more important than any single rating.** A daily Buy rating means little without context. The same daily Buy rating in the context of a weekly and monthly recovery is a meaningful structural signal. Read the matrix as a system, not as four independent scores.

**Strong Buy across all timeframes is a carry cost signal, not an entry signal.** When all four timeframes are in Strong Buy, the instrument is extended at every horizon. The MA votes are fully positive, meaning price is well above all its averages. This is not the time to add exposure — it is the time to assess whether the reward for holding is still proportionate to the risk of disappointment.

---

*Last updated: May 2026*
