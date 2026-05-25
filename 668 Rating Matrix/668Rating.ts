# 668 Rating
# ThinkScript approximation of TradingView Technical Ratings for the chart timeframe.

declare upper;

input ratingMode = { default All, MAs, Oscillators };
input maWeightPercent = 50;
input showNumericScore = yes;
input trendLength = 50;
input fullColorAtRating = 0.5;
input minActiveColorStrength = 35;
input showDebugValues = no;

DefineGlobalColor("Bull", CreateColor(74, 173, 175));
DefineGlobalColor("Bear", CreateColor(175, 76, 74));
DefineGlobalColor("Neutral", CreateColor(128, 128, 128));

def LEVEL_STRONG = 0.5;
def LEVEL_WEAK = 0.1;
def maWeight = maWeightPercent / 100;
def oscWeight = 1 - maWeight;

script Vote {
    input buy = no;
    input sell = no;
    plot result = if buy then 1 else if sell then - 1 else 0;
}

script VoteIf {
    input valid = yes;
    input buy = no;
    input sell = no;
    plot result = if valid and buy then 1 else if valid and sell then -1 else 0;
}

script SafeRatio {
    input numerator = 0.0;
    input denominator = 1.0;
    plot result = if denominator != 0 then numerator / denominator else 0;
}

script GetBullColorRGB {
    input v = 50.0;

    def rNeutral = 128;
    def gNeutral = 128;
    def bNeutral = 128;
    def rBull = 74;
    def gBull = 173;
    def bBull = 175;

    def t = Max(0, Min(1, v / 100));
    plot R = Round(rNeutral + (rBull - rNeutral) * t, 0);
    plot G = Round(gNeutral + (gBull - gNeutral) * t, 0);
    plot B = Round(bNeutral + (bBull - bNeutral) * t, 0);
}

script GetBearColorRGB {
    input v = 50.0;

    def rNeutral = 128;
    def gNeutral = 128;
    def bNeutral = 128;
    def rBear = 175;
    def gBear = 76;
    def bBear = 74;

    def t = Max(0, Min(1, v / 100));
    plot R = Round(rNeutral + (rBear - rNeutral) * t, 0);
    plot G = Round(gNeutral + (gBear - gNeutral) * t, 0);
    plot B = Round(bNeutral + (bBear - bNeutral) * t, 0);
}

def src = close;
def hl2 = (high + low) / 2;
def typicalPrice = (high + low + close) / 3;
def barCount = BarNumber();

# Moving averages and filters.
def sma10Ready = barCount >= 10;
def sma20Ready = barCount >= 20;
def sma30Ready = barCount >= 30;
def sma50Ready = barCount >= 50;
def sma100Ready = barCount >= 100;
def sma200Ready = barCount >= 200;
def ema10Ready = barCount >= 10;
def ema20Ready = barCount >= 20;
def ema30Ready = barCount >= 30;
def ema50Ready = barCount >= 50;
def ema100Ready = barCount >= 100;
def ema200Ready = barCount >= 200;
def hma9Ready = barCount >= 9;
def vwma20Ready = barCount >= 20;
def ichimokuReady = barCount >= 52;

def sma10 = if sma10Ready then Average(src, 10) else src;
def sma20 = if sma20Ready then Average(src, 20) else src;
def sma30 = if sma30Ready then Average(src, 30) else src;
def sma50 = if sma50Ready then Average(src, 50) else src;
def sma100 = if sma100Ready then Average(src, 100) else src;
def sma200 = if sma200Ready then Average(src, 200) else src;

def ema10 = if ema10Ready then ExpAverage(src, 10) else src;
def ema20 = if ema20Ready then ExpAverage(src, 20) else src;
def ema30 = if ema30Ready then ExpAverage(src, 30) else src;
def ema50 = if ema50Ready then ExpAverage(src, 50) else src;
def ema100 = if ema100Ready then ExpAverage(src, 100) else src;
def ema200 = if ema200Ready then ExpAverage(src, 200) else src;

def hma9 = if hma9Ready then HullMovingAvg(price = src, length = 9) else src;
def vwma20 = if vwma20Ready then SafeRatio(Sum(volume * src, 20), Sum(volume, 20)) else src;

def ichimokuConversion = if ichimokuReady then (Highest(high, 9) + Lowest(low, 9)) / 2 else src;
def ichimokuBase = if ichimokuReady then (Highest(high, 26) + Lowest(low, 26)) / 2 else src;
def ichimokuSpanA = if ichimokuReady then (ichimokuConversion + ichimokuBase) / 2 else src;
def ichimokuSpanB = if ichimokuReady then (Highest(high, 52) + Lowest(low, 52)) / 2 else src;

def sma10Vote = VoteIf(sma10Ready, src > sma10, src < sma10);
def sma20Vote = VoteIf(sma20Ready, src > sma20, src < sma20);
def sma30Vote = VoteIf(sma30Ready, src > sma30, src < sma30);
def sma50Vote = VoteIf(sma50Ready, src > sma50, src < sma50);
def sma100Vote = VoteIf(sma100Ready, src > sma100, src < sma100);
def sma200Vote = VoteIf(sma200Ready, src > sma200, src < sma200);
def ema10Vote = VoteIf(ema10Ready, src > ema10, src < ema10);
def ema20Vote = VoteIf(ema20Ready, src > ema20, src < ema20);
def ema30Vote = VoteIf(ema30Ready, src > ema30, src < ema30);
def ema50Vote = VoteIf(ema50Ready, src > ema50, src < ema50);
def ema100Vote = VoteIf(ema100Ready, src > ema100, src < ema100);
def ema200Vote = VoteIf(ema200Ready, src > ema200, src < ema200);
def hma9Vote = VoteIf(hma9Ready, src > hma9, src < hma9);
def vwma20Vote = VoteIf(vwma20Ready, src > vwma20, src < vwma20);
def ichimokuVote = VoteIf(
    ichimokuReady,
    ichimokuSpanA > ichimokuSpanB and ichimokuBase > ichimokuSpanA and ichimokuConversion > ichimokuBase and src > ichimokuConversion,
    ichimokuSpanA < ichimokuSpanB and ichimokuBase < ichimokuSpanA and ichimokuConversion < ichimokuBase and src < ichimokuConversion
);

def maVote =
    sma10Vote +
    sma20Vote +
    sma30Vote +
    sma50Vote +
    sma100Vote +
    sma200Vote +
    ema10Vote +
    ema20Vote +
    ema30Vote +
    ema50Vote +
    ema100Vote +
    ema200Vote +
    hma9Vote +
    vwma20Vote +
    ichimokuVote;

def maRating = maVote / 15;

# Oscillators and indicators.
def rsiReady = barCount >= 15;
def rsi = if rsiReady then RSI(price = src, length = 14) else 50;
def rsiVote = VoteIf(rsiReady, rsi < 30 and rsi > rsi[1], rsi > 70 and rsi < rsi[1]);

def stochReady = barCount >= 16;
def stochRange = if stochReady then Highest(high, 14) - Lowest(low, 14) else 0;
def stochFastK = if stochRange != 0 then 100 * (src - Lowest(low, 14)) / stochRange else 0;
def stochK = if stochReady then Average(stochFastK, 3) else 50;
def stochD = if stochReady then Average(stochK, 3) else 50;
def stochVote = VoteIf(stochReady, stochK < 20 and stochD < 20 and stochK > stochD, stochK > 80 and stochD > 80 and stochK < stochD);

def cciReady = barCount >= 21;
def cciAverage = if cciReady then Average(typicalPrice, 20) else typicalPrice;
def cciMeanDeviation = if cciReady then Average(AbsValue(typicalPrice - cciAverage), 20) else 0;
def cci = if cciMeanDeviation != 0 then(typicalPrice - cciAverage) / (0.015 * cciMeanDeviation) else 0;
def cciVote = VoteIf(cciReady, cci < -100 and cci > cci[1], cci > 100 and cci < cci[1]);

def adxReady = barCount >= 28;
def tr = TrueRange(high, close, low);
def upMove = high - high[1];
def downMove = low[1] - low;
def plusDM = if upMove > downMove and upMove > 0 then upMove else 0;
def minusDM = if downMove > upMove and downMove > 0 then downMove else 0;
def atr = if adxReady then WildersAverage(tr, 14) else 0;
def plusDI = if adxReady then 100 * SafeRatio(WildersAverage(plusDM, 14), atr) else 0;
def minusDI = if adxReady then 100 * SafeRatio(WildersAverage(minusDM, 14), atr) else 0;
def dx = 100 * SafeRatio(AbsValue(plusDI - minusDI), plusDI + minusDI);
def adx = if adxReady then WildersAverage(dx, 14) else 0;
def adxVote = VoteIf(adxReady, plusDI > minusDI and adx > 20 and adx > adx[1], plusDI < minusDI and adx > 20 and adx < adx[1]);

def aoReady = barCount >= 36;
def ao = if aoReady then Average(hl2, 5) - Average(hl2, 34) else 0;
def aoCrossUp = ao > 0 and ao[1] <= 0;
def aoCrossDown = ao < 0 and ao[1] >= 0;
def aoTurnsUp = ao > 0 and ao[1] > 0 and ao > ao[1] and ao[1] < ao[2];
def aoTurnsDown = ao < 0 and ao[1] < 0 and ao < ao[1] and ao[1] > ao[2];
def aoVote = VoteIf(aoReady, aoCrossUp or aoTurnsUp, aoCrossDown or aoTurnsDown);

def momentumReady = barCount >= 11;
def momentum = if momentumReady then src - src[10] else 0;
def momentumVote = VoteIf(momentumReady, momentum > momentum[1], momentum < momentum[1]);

def macdReady = barCount >= 35;
def macd = if macdReady then ExpAverage(src, 12) - ExpAverage(src, 26) else 0;
def macdSignal = if macdReady then ExpAverage(macd, 9) else 0;
def macdVote = VoteIf(macdReady, macd > macdSignal, macd < macdSignal);

def stochRsiReady = barCount >= 18;
def rsiLowest = if stochRsiReady then Lowest(rsi, 14) else 0;
def rsiHighest = if stochRsiReady then Highest(rsi, 14) else 100;
def stochRsiFastK = if rsiHighest != rsiLowest then 100 * (rsi - rsiLowest) / (rsiHighest - rsiLowest) else 0;
def stochRsiK = if stochRsiReady then Average(stochRsiFastK, 3) else 50;
def stochRsiD = if stochRsiReady then Average(stochRsiK, 3) else 50;
def uptrend = src > ExpAverage(src, trendLength);
def downtrend = src < ExpAverage(src, trendLength);
def stochRsiVote = VoteIf(stochRsiReady, downtrend and stochRsiK < 20 and stochRsiD < 20 and stochRsiK > stochRsiD, uptrend and stochRsiK > 80 and stochRsiD > 80 and stochRsiK < stochRsiD);

def williamsReady = barCount >= 15;
def williamsHigh = if williamsReady then Highest(high, 14) else high;
def williamsLow = if williamsReady then Lowest(low, 14) else low;
def williamsR = if williamsHigh != williamsLow then - 100 * (williamsHigh - src) / (williamsHigh - williamsLow) else 0;
def williamsVote = VoteIf(williamsReady, williamsR < -80 and williamsR > williamsR[1], williamsR > -20 and williamsR < williamsR[1]);

def bullBearReady = barCount >= Max(14, trendLength);
def elderEma = if bullBearReady then ExpAverage(src, 13) else src;
def bullPower = high - elderEma;
def bearPower = low - elderEma;
def bullBearVote = VoteIf(bullBearReady, uptrend and bearPower < 0 and bearPower > bearPower[1], downtrend and bullPower > 0 and bullPower < bullPower[1]);

def ultimateReady = barCount >= 28;
def bp = src - Min(low, src[1]);
def uoTr = Max(high, src[1]) - Min(low, src[1]);
def avg7 = if ultimateReady then SafeRatio(Sum(bp, 7), Sum(uoTr, 7)) else 0;
def avg14 = if ultimateReady then SafeRatio(Sum(bp, 14), Sum(uoTr, 14)) else 0;
def avg28 = if ultimateReady then SafeRatio(Sum(bp, 28), Sum(uoTr, 28)) else 0;
def ultimateOsc = if ultimateReady then 100 * (4 * avg7 + 2 * avg14 + avg28) / 7 else 50;
def ultimateVote = VoteIf(ultimateReady, ultimateOsc > 70, ultimateOsc < 30);

def oscVote =
    rsiVote +
    stochVote +
    cciVote +
    adxVote +
    aoVote +
    momentumVote +
    macdVote +
    stochRsiVote +
    williamsVote +
    bullBearVote +
    ultimateVote;

def oscRating = oscVote / 11;
def allRating = maRating * maWeight + oscRating * oscWeight;

def rating =
    if ratingMode == ratingMode.MAs then maRating
    else if ratingMode == ratingMode.Oscillators then oscRating
    else allRating;

def isStrongBuy = rating > LEVEL_STRONG;
def isBuy = rating > LEVEL_WEAK and rating <= LEVEL_STRONG;
def isStrongSell = rating < -LEVEL_STRONG;
def isSell = rating < -LEVEL_WEAK and rating >= -LEVEL_STRONG;
def rawColorStrength = 100 * Min(AbsValue(rating) / fullColorAtRating, 1);
def colorStrength = if isStrongBuy or isBuy or isStrongSell or isSell then Max(minActiveColorStrength, rawColorStrength) else 0;

AddLabel(
    yes,
    (if isStrongBuy then "Strong Buy"
        else if isBuy then "Buy"
        else if isStrongSell then "Strong Sell"
        else if isSell then "Sell"
        else "Neutral") +
    (if showNumericScore then " (" + AsText(Round(rating, 2)) + ")" else ""),
if isStrongBuy or isBuy then CreateColor(GetBullColorRGB(colorStrength).R, GetBullColorRGB(colorStrength).G, GetBullColorRGB(colorStrength).B)
    else if isStrongSell or isSell then CreateColor(GetBearColorRGB(colorStrength).R, GetBearColorRGB(colorStrength).G, GetBearColorRGB(colorStrength).B)
    else GlobalColor("Neutral"),
    Location.TOP_RIGHT,
    FontSize.SMALL
);

AddLabel(showDebugValues, "All: " + AsText(Round(allRating, 4)), Color.GRAY, Location.BOTTOM_RIGHT, FontSize.SMALL);
AddLabel(showDebugValues, "MAs: " + AsText(Round(maRating, 4)) + " (" + AsText(maVote) + "/15)", Color.GRAY, Location.BOTTOM_RIGHT, FontSize.SMALL);
AddLabel(showDebugValues, "Osc: " + AsText(Round(oscRating, 4)) + " (" + AsText(oscVote) + "/11)", Color.GRAY, Location.BOTTOM_RIGHT, FontSize.SMALL);
AddLabel(
    showDebugValues,
    "SMA " + AsText(sma10Vote) + " " + AsText(sma20Vote) + " " + AsText(sma30Vote) + " " + AsText(sma50Vote) + " " + AsText(sma100Vote) + " " + AsText(sma200Vote),
    Color.GRAY,
    Location.BOTTOM_RIGHT,
    FontSize.SMALL
);
AddLabel(
    showDebugValues,
    "EMA " + AsText(ema10Vote) + " " + AsText(ema20Vote) + " " + AsText(ema30Vote) + " " + AsText(ema50Vote) + " " + AsText(ema100Vote) + " " + AsText(ema200Vote),
    Color.GRAY,
    Location.BOTTOM_RIGHT,
    FontSize.SMALL
);
AddLabel(
    showDebugValues,
    "HMA9 " + AsText(hma9Vote) + " VWMA20 " + AsText(vwma20Vote) + " Ichi " + AsText(ichimokuVote),
    Color.GRAY,
    Location.BOTTOM_RIGHT,
    FontSize.SMALL
);
