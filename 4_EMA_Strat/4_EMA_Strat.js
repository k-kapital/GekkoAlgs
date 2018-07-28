
// Source: https://raw.githubusercontent.com/vrfurl/gekko/stable/strategies/EMACrossover.js
// Downloaded from: https://github.com/xFFFFF/Gekko-Strategies
// helpers
var _ = require('lodash');
var log = require('../core/log.js');
var stopLossSold = false;
var lastBuyPrice = 0;
var profit = 0;
var stopLossPercent = 0.03;
var uptrend = false;

var method = {};

method.init = function() {
  this.name = '4EMACrossover';
  this.currentTrend;
  this.requiredHistory = 0;
  //Determine if we first want to buy or sell
  if(this.settings.firstTrade === 'buy') {
    this.currentTrend = 'down';
  }
  else if(this.settings.firstTrade === 'sell'){
    this.currentTrend = 'up';
  }
  //Tampered with the next 8 lines in order to turn it into a 4EMA strat rather than 2
  this.addTalibIndicator('shortestEMA', 'ema', {optInTimePeriod : this.settings.shortestSize});
  this.addTalibIndicator('shortEMA', 'ema', {optInTimePeriod : this.settings.shortSize});
  this.addTalibIndicator('longEMA', 'ema', {optInTimePeriod : this.settings.longSize});
  this.addTalibIndicator('longestEMA', 'ema', {optInTimePeriod : this.settings.longestSize});
  log.debug(this.name+' Strategy initialized');
},

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
},

method.check = function(candle) {
  //var shortEma = this.talibIndicators.shortestEMA.result.outReal;
  var middleEma = this.talibIndicators.longEMA.result.outReal;
  var longEma = this.talibIndicators.longestEMA.result.outReal;
  var shortResult = this.talibIndicators.shortestEMA.result.outReal;
  var price = candle.close;
  var message = '@ ' + price.toFixed(8);

  var historicalShortestEmas = new Array();
  var deltas = new Array();
  historicalShortestEmas.push(shortResult);

  var lastShortestEma = historicalShortestEmas[historicalShortestEmas.length];
  var delta = shortResult - lastShortestEma;
  deltas.push(delta);
  if (delta > 0) {
    //shits positive
  }
  // if this delta is greater than the last
  if(delta > deltas[deltas.length - 1]) {
    // slope is increasing
  }

  //starting fresh
  // If we are in an uptrend
  if (middleEma > longEma){
    // if it has not already been an uptrend, BUY
    if (!uptrend) {
      uptrend = true;
      log.debug('Buyng at: ', message)
      lastBuyPrice = price;
      this.advice('long');
    }
  }

  // If we are in a Downtrend
  if (middleEma < longEma) {
    // If it has been an uptrend but is now a downtrend, SELL
    if (uptrend) {
      uptrend = false;
      log.debug('Selling at: ', message)
      profit = price - lastBuyPrice;
      log.debug('profit: ', profit, '\n');
      this.advice('short');
    }
  }
},

module.exports = method;
