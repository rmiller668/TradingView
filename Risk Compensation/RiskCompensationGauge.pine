//@version=6
indicator("Risk Compensation(%)", "668 RCG", overlay = false)

// Risk Compensation Gauge (RCG)
//
// The Risk Compensation Gauge (RCG) reveals the Compensation Environment
// of an asset by measuring the compensation received for carrying risk.
//
// Markets do not transact in truth.
// Markets transact in risk.
//
// Markets do not compensate participants for avoiding risk.
// Markets compensate participants for accepting risk that is being rewarded.
//
// Price determines the cost of participation.
// Compensation determines the quality of that participation.
//
// A sliding return window compares today's close to the close
// Basis Periods ago. As each new bar forms, both the entry and
// exit points move forward, creating a continuous evaluation
// of compensation received for carrying risk.
//
// Basis Compensation (Mechanics):
// Measures the percentage return between today's close and the
// close Basis Periods ago.
//
// Basis Compensation (Meaning):
// Represents the current compensation received by participants
// carrying risk over the selected Basis Period.
//
// Compensation Environment (Mechanics):
// Averages recent Basis Compensation measurements over the
// Compensation Environment Period.
//
// Each Basis value represents a separate sliding-window return,
// and the Compensation Environment is the average of those
// recent compensation outcomes.
//
// Compensation Environment (Meaning):
// Represents the recent compensation regime,
// revealing whether compensation is generally improving
// or deteriorating relative to recent history.
//
// Structural Compensation Environment (Mechanics):
// Averages Basis Compensation measurements over a longer horizon,
// creating a deeper compensation baseline.
//
// Structural Compensation Environment (Meaning):
// Represents the longer-term compensation regime,
// providing context for whether the current Compensation
// Environment is stronger or weaker than the asset's
// historical compensation structure.
//
// Zero Line:
// Boundary between positive and negative compensation.
//
// Interpretation:
//
// Basis Compensation > Compensation Environment
// = Compensation improving relative to the recent environment.
//
// Basis Compensation < Compensation Environment
// = Compensation deteriorating relative to the recent environment.
//
// Compensation Environment > Structural Compensation Environment
// = Recent compensation environment stronger than the
//   longer-term compensation structure.
//
// Compensation Environment < Structural Compensation Environment
// = Recent compensation environment weaker than the
//   longer-term compensation structure.
//
// Above Zero = Positive compensation.
// Below Zero = Negative compensation.
//
// Together they answer:
//
// 1. Is compensation positive or negative?
// 2. Is compensation improving or deteriorating?
// 3. Is the recent compensation environment stronger or weaker
//    than the longer-term compensation structure?
// 4. Is the compensation sufficient to justify carrying the risk?

// ── Inputs ─────────────────────────────────────────────
basisPeriod        = input.int(12, "Basis Period", minval = 1, tooltip = "Sliding lookback window used to measure current compensation.")
environmentPeriod  = input.int(12, "Compensation Environment Period", minval = 1, tooltip = "Number of recent Basis measurements averaged to reveal the current compensation environment.")
structuralPeriod   = input.int(60, "Structural Environment Period", minval = 1, tooltip = "Number of recent Basis measurements averaged to reveal the structural compensation environment.")

// ── Risk Compensation Calculation ──────────────────────
basePrice = close[basisPeriod]

basisRoR       = na(basePrice) ? na : ((close - basePrice) / basePrice) * 100
environmentRoR = ta.sma(basisRoR, environmentPeriod)
structuralRoR  = ta.sma(basisRoR, structuralPeriod)

// ── Plots ──────────────────────────────────────────────
plot(environmentRoR, title = "Compensation Environment (%)", linewidth = 2, color = color(#90bff9))
plot(structuralRoR, title = "Structural Compensation Environment (%)", linewidth = 2, color = color(#6f7f94), linestyle = plot.linestyle_dotted)
plot(basisRoR, title = "Basis Compensation (%)", linewidth = 2, color = color.new(#dbdbdb, 70))

// ── Zero Line ──────────────────────────────────────────
hline(0, "Zero Line", linewidth = 1, linestyle = hline.style_solid, color = color(#636363))

// Compensation States:
//
// Positive and Improving
// Basis Compensation > Compensation Environment > 0
//
// Current compensation exceeds the recent compensation environment.
// Participants carrying risk over the selected horizon are receiving
// increasing compensation.
//
// Positive but Deteriorating
// Compensation Environment > Basis Compensation > 0
//
// Compensation remains positive, but current compensation is
// weakening relative to the recent compensation environment.
//
// Negative Beginning
// Basis Compensation < 0 < Compensation Environment
//
// Current compensation has turned negative while the recent
// compensation environment remains positive.
//
// This represents a transition from positive to negative compensation.
//
// Negative and Deteriorating
// Basis Compensation < Compensation Environment < 0
//
// Compensation is negative and current compensation continues
// to weaken relative to the recent compensation environment.
//
// Participants carrying risk are receiving increasingly
// unfavorable compensation outcomes.
//
// Negative but Decelerating
// Compensation Environment < 0
// Basis Compensation > Compensation Environment
//
// Compensation remains negative, but current compensation
// is improving relative to the recent compensation environment.
//
// The penalty for carrying risk is becoming less severe.
//
// Returning Positive
// Basis Compensation > 0
// Compensation Environment < 0
//
// Current compensation has turned positive while the recent
// compensation environment remains negative.
//
// This represents a transition from negative to positive compensation.
//
// Structural Context:
//
// Compensation Environment > Structural Compensation Environment
//
// The recent compensation environment is stronger than the
// longer-term compensation structure.
//
// Compensation Environment < Structural Compensation Environment
//
// The recent compensation environment is weaker than the
// longer-term compensation structure.
//
// The goal is not to identify the exact price top or bottom.
// The goal is to identify whether compensation is positive
// or negative, improving or deteriorating, and whether the
// current compensation environment is strengthening or
// weakening relative to the asset's longer-term
// compensation structure.