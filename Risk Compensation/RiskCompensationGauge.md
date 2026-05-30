# The Risk Compensation Gauge (RCG)

## A Framework for Understanding Market Compensation

### Introduction

Most market analysis begins with price. Investors, traders, analysts, and commentators spend considerable effort attempting to determine whether prices are too high, too low, near a top, near a bottom, overbought, oversold, expensive, or cheap. While these observations may have value, they often overlook a more fundamental question:

**What is the market currently paying participants for accepting risk?**

The Risk Compensation Gauge (RCG) was developed to answer that question.

Rather than focusing on price itself, the RCG focuses on the outcome of carrying risk. It measures whether market participants have been rewarded or punished for accepting risk over a defined holding period, and whether that compensation is improving or deteriorating over time.

The RCG is not intended to predict future prices. Instead, it evaluates the current and recent quality of compensation available to participants who have accepted market risk.

---

## The Foundation

Every market participant ultimately engages in a simple exchange:

```text
Capital
   ↓
Risk
   ↓
Compensation
```

Capital is committed. Risk is accepted. Compensation is either received or denied.

The traditional view of markets often emphasizes the first step and the last step simultaneously, while largely ignoring the relationship between them. The RCG focuses directly on that relationship.

Two principles form the foundation of the framework:

> Price determines the cost of participation.

> Risk compensation determines the quality of that participation.

These principles shift the focus away from price itself and toward the outcome produced by carrying risk.

A stock trading at $20 may be a poor opportunity if compensation continues to deteriorate. A stock trading at $500 may be an excellent opportunity if compensation continues to improve.

Price alone does not determine opportunity, compensation does.

---

## What the RCG Measures

The RCG uses a sliding return window.

For every bar on the chart, the indicator compares the current closing price with the closing price a specified number of periods ago.

For example, on a monthly chart using a Basis Period of 12:

```text
Current Close
      vs
Close 12 Months Ago
```

The result is expressed as a percentage return.

Importantly, this is not a fixed-entry measurement.

The entire measurement window slides forward with each new bar.

```text
+----------+
 +----------+
  +----------+
   +----------+
    +----------+
```

Both the entry point and exit point move forward while the holding period remains constant.

This means the indicator continuously evaluates a series of separate holding periods rather than following a single investment through time.

The Basis Line therefore answers the question:

> If an investor entered exactly one Basis Period ago and exited today, what compensation did they receive for carrying risk?

---

## The Basis Line

The Basis Line represents current compensation.

Mechanically, it is the percentage return generated between today's close and the close Basis Periods ago.

Conceptually, it represents the current reward or penalty received for carrying risk over the selected holding period.

A positive Basis value indicates that participants have been compensated for carrying risk.

A negative Basis value indicates that participants have been punished for carrying risk.

The Basis Line can therefore be viewed as a direct measure of current compensation.

---

## The Trend Line

The Trend Line is a smoothed average of recent Basis measurements.

Mechanically, it is the average of Basis values over the selected Smoothing Period.

Conceptually, it represents the underlying trend of compensation.

While the Basis Line measures the current compensation environment, the Trend Line measures the recent average compensation environment.

This distinction is critical.

The Basis Line answers:

> What compensation is being received now?

The Trend Line answers:

> What compensation has generally been received recently?

The relationship between these two lines provides important insight into changing market conditions.

---

## The Zero Line

The Zero Line serves as the boundary between positive and negative compensation.

Above Zero:

> Compensation is positive.

Below Zero:

> Compensation is negative.

This line provides a clear separation between environments where participants are generally rewarded and environments where participants are generally punished.

---

## Understanding Compensation

One of the most important conclusions reached through the development of the RCG is that markets are not primarily price systems.

They are compensation systems.

Participants do not enter markets because they desire risk.

They enter markets because they expect compensation sufficient to justify accepting risk.

The market does not reward participants for avoiding risk.

The market compensates participants for accepting risk that is being rewarded.

This distinction is subtle but profound.

The RCG therefore focuses on compensation rather than price.

---

## Interpreting the RCG

The indicator revolves around three components:

* Basis Line
* Trend Line
* Zero Line

Together they answer three questions:

1. Is compensation positive or negative?
2. Is compensation improving or deteriorating?
3. Is compensation sufficient to justify carrying the risk?

The relationship between the Basis Line and Trend Line is especially important.

### Basis Above Trend

When the Basis Line is above the Trend Line, current compensation exceeds the recent average.

Compensation is improving.

### Basis Below Trend

When the Basis Line is below the Trend Line, current compensation is weaker than the recent average.

Compensation is deteriorating.

### Above Zero

Compensation is positive.

### Below Zero

Compensation is negative.

---

## The Compensation Cycle

The RCG naturally reveals a compensation cycle that frequently corresponds with major market phases.

### Compensation Expanding

```text
Basis > Trend > 0
```

Compensation is positive and improving.

Participants are being rewarded, and that reward is increasing.

### Compensation Deteriorating

```text
Trend > Basis > 0
```

Compensation remains positive but is weakening.

Participants continue to be rewarded, though less generously than before.

### Negative Compensation Beginning

```text
Basis < 0 < Trend
```

Current compensation has turned negative while recent compensation remains positive.

A transition is underway.

### Negative Compensation Accelerating

```text
Basis < Trend < 0
```

Compensation is negative and deteriorating.

Participants are being punished, and the severity of that punishment is increasing.

### Negative Compensation Decelerating

```text
Trend < 0
Basis > Trend
```

Compensation remains negative, but the punishment is becoming less severe.

This often marks the early stages of recovery.

### Compensation Returning

```text
Basis > 0
Trend < 0
```

Current compensation has become positive while recent compensation remains negative.

Recovery is underway.

### Compensation Expanding Again

```text
Basis > Trend > 0
```

Compensation is positive and improving.

A new expansion cycle may be emerging.

---

## A Different Way to View Bottoms

Traditional analysis often attempts to identify the exact market bottom.

The RCG approaches the problem differently.

Rather than asking:

> Has the market bottomed?

It asks:

> Has compensation begun to improve?

Bottoms are often not characterized by maximum punishment.

They are characterized by diminishing punishment.

The market frequently begins improving compensation before a new uptrend becomes obvious in price.

As a result, the RCG focuses on changing compensation rather than precise turning points.

---

## Conclusion

The Risk Compensation Gauge is not a forecasting tool.

It is an observational framework.

It seeks to answer a simple but foundational question:

> What compensation is the market currently providing to participants who accept risk?

By measuring current compensation, average compensation, and the relationship between them, the RCG provides a structured view of the market's compensation environment.

Price determines the cost of participation.

Risk compensation determines the quality of that participation.

The goal is not to identify the exact top or bottom.

The goal is to identify when compensation is improving, deteriorating, or changing regimes.

In the end, markets are not merely collections of prices.

They are systems of compensation.

The Risk Compensation Gauge exists to measure that compensation.
