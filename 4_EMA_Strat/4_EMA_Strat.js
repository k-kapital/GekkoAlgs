
// Source: https://raw.githubusercontent.com/vrfurl/gekko/stable/strategies/EMACrossover.js
// Downloaded from: https://github.com/xFFFFF/Gekko-Strategies
// helpers
var _ = require('lodash');
var log = require('../core/log.js');
// let's create our own method
var method = {};
// prepare everything our method needs
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
  log.debug("Shortest EMA size: "+this.settings.shortestSize);
  log.debug("Short EMA size: "+this.settings.shortSize);
  log.debug("Long EMA size: "+this.settings.longSize);
  log.debug("Longest EMA size: "+this.settings.longestSize);
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

//Tampered with the next section to again add more EMAs
// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  var shortestEMA = this.talibIndicators.shortestEMA;
  var shortEMA = this.talibIndicators.shortEMA;
  var longEMA = this.talibIndicators.longEMA;
  var longestEMA = this.talibIndicators.longestEMA;
  log.debug('Required history is: '+this.requiredHistory);
  log.debug('calculated EMA properties for candle:');
  log.debug('\t shortestEMA :', shortestEMA.result);
  log.debug('\t shortEMA :', shortEMA.result);
  log.debug('\t longEMA :', longEMA.result);
  log.debug('\t', 'longestEMA:', longestEMA.result);
},

//Tampered to add EMAs again
method.check = function(candle) {
  var shortestResult = this.talibIndicators.shortestEMA.result.outReal;
  var shortResult = this.talibIndicators.shortEMA.result.outReal;
  var longResult = this.talibIndicators.longEMA.result.outReal;
  var longestResult = this.talibIndicators.longestEMA.result.outReal;
  var price = candle.close;
  var message = '@ ' + price.toFixed(8);
// Here is where I could use some assistance translating from pseudo code
  //EMA Golden Cross
  if(shortestResult >  shortResult > longResult > longestResult) {
    log.debug('we are currently in uptrend', message);
    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
      this.advice('long');
      log.debug("Going to buy");
    } else {
      log.debug("Nothing to buy");
      this.advice();
    }
  } else if(longestResult > shortestResult) {
    log.debug('we are currently in a downtrend', message);
    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      this.advice('short');
      log.debug("Going to sell");
    } else
      log.debug("Nothing to sell");
      this.advice();
  } else {
    log.debug('we are currently not in an up or down trend', message);
    this.advice();
  }
},

module.exports = method;
