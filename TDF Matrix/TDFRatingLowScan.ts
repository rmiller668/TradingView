# TDF Rating Low

def agg = GetAggregationPeriod();

def prPeriod  = if agg == AggregationPeriod.QUARTER then 4 else if agg == AggregationPeriod.WEEK then 26 else 12;
def bbPeriod  = if agg == AggregationPeriod.QUARTER then 12 else if agg == AggregationPeriod.WEEK then 12 else 12;;
def volPeriod = if agg == AggregationPeriod.QUARTER then 4 else if agg == AggregationPeriod.WEEK then 26 else 12;
def smoothing = 5;

# ---------- Helper Scripts ----------
script pctP {
    input period = 4;
    def hi = Highest(high, period);
    def lo = Lowest(low, period);
    plot out = if (hi - lo) == 0
        then Double.NaN
        else Round(((close - lo) / (hi - lo)) * 100, 0);
}

script pctB {
    input period = 12;
    input numDev = 2.0;
    def ma = Average(close, period);
    def sd = StDev(close, period);
    def upper = ma + numDev * sd;
    def lower = ma - numDev * sd;
    plot out = if (upper - lower) == 0
        then Double.NaN
        else Round(((close - lower) / (upper - lower)) * 100, 0);
}

script pctV {
    input period   = 4;
    input baseline = 40;  # e.g., volPeriod * 10 outside
    def v    = Average(volume, period);
    def base = Average(volume, baseline);
    plot out = if base == 0 then Double.NaN else (v / base) * 50;
}

# ---------- %P Stack ----------
def p1  = pctP(prPeriod);
def p3  = pctP(prPeriod * 3);
def p5  = pctP(prPeriod * 5);
def p10 = pctP(prPeriod * 10);
def px  = (p1 + p3 + p5 + p10) / 4;

# ---------- %B Stack ----------
def b1  = pctB(bbPeriod);
def b3  = pctB(bbPeriod * 3);
def b5  = pctB(bbPeriod * 5);
def b10 = pctB(bbPeriod * 10);
def bx  = (b1 + b3 + b5 + b10) / 4;

# ---------- %V Stack ----------
def baseV = volPeriod * 10;
def v1  = pctV(volPeriod, baseV);
def v3  = pctV(volPeriod * 3, baseV);
def v5  = pctV(volPeriod * 5, baseV);
def v10 = 50.0;  # fixed neutral anchor
def vx  = (v1 + v3 + v5 + v10) / 4;

# ---------- Vertical Composites (%Y) ----------
def y1  = (p1 + b1 + v1) / 3;
def y3  = (p3 + b3 + v3) / 3;
def y5  = (p5 + b5 + v5) / 3;
def y10 = (p10 + b10 + v10) / 3;

# ---------- Final TDF Rating ----------
def xComposite = (px + bx + vx) / 3;
def yComposite = (y1 + y3 + y5 + y10) / 4;
def tdfRating = (xComposite + yComposite) / 2;

def tdfSmoothed = ExpAverage(tdfRating, smoothing);


def vxSmoothed = ExpAverage(vx, smoothing);
plot scan = tdfSmoothed < 35 and vx > 40 and vx > vxSmoothed[1];