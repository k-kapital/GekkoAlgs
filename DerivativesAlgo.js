// Source: https://raw.githubusercontent.com/vrfurl/gekko/stable/strategies/EMACrossover.js
// Downloaded from: https://github.com/xFFFFF/Gekko-Strategies
// helpers
var _ = require('lodash');
var log = require('../core/log.js');
var stopLossSold = false;
var lastBuyPrice = 0;
var stopLossPercent = 0.03;
var debugMode = false

var indicatorData = {};
// let's create our own method
var method = {};

method.addIndicator=function(name,type,optTimePeriod){
  indicatorData [name] = {indicatorName:type,optInTimePeriod: optTimePeriod}
  this.addTalibIndicator(property, indicatorData[property].indicatorName, {optInTimePeriod : indicatorData[property].optInTimePeriod});
  method.addIndicatorProperty(name,'indicator',this.talibIndicators[name])
};

method.addIndicatorProperty=function(indicatorName,fieldName,valueToInsert){
  Object.defineProperty(indicatorData[indicatorName],fieldName,{value: valueToInsert, writable: true});
};

method.getIndicatorProperty=function(indicatorName,field){
    return indicatorData[indicatorName][field];
};

method.updateIndicatorResults= function(){
for (var property in indicatorData) {
    if (indicatorData.hasOwnProperty(property)) {
        var newResult = this.talibIndicators[property].result;
        
        if(!indicatorData[property].hasOwnProperty('delta')){
           method.addIndicatorProperty(property,'delta', 0);
        }else{
              method.addIndicatorProperty(property,'delta', newResult - indicatorData[property].result );
        }
        method.addIndicatorProperty(property,'result',newResult);

    }
}
};



// prepare everything our method needs
method.init = function() {
  this.name = '4EMACrossover';
  this.currentTrend;
  this.requiredHistory = 0;
  //Here we define indicators


  method.addIndicator('shortEMA','ema',this.settings.shortSizeEMA);
  method.addIndicator('shortestEMA','ema',this.settings.shortestSizeEMA);
  method.addIndicator('longEMA','ema',this.settings.longSizeEMA);
  method.addIndicator('longest','ema',this.settings.longestSizeEMA);
  method.addIndicator('WMA1','wma',this.settings.WMA1Size);
  method.addIndicator('WMA2','wma',this.settings.WMA2Size);
  method.addIndicator('WMA3','wma',this.settings.WMA3Size);
  method.addIndicator('SMA1','sma',this.settings.SMA1Size);
  method.addIndicator('DELTAEMA1',[NEEDS TO BE DEFINED,this.settings.DELTAEMA1Size);
  method.addIndicator('TEMA1','tema',this.settings.TEMA1Size);
  method.addIndicator('TILSONT3','tilsonema',this.settings.TILSONT3size)
      
      
  //this.addTalibIndicator('shortestEMA', 'ema', {optInTimePeriod : this.settings.shortestSizeEMA});
  //this.addTalibIndicator('shortEMA', 'ema', {optInTimePeriod : this.settings.shortSize});
 // this.addTalibIndicator('longEMA', 'ema', {optInTimePeriod : this.settings.longSizeEMA});
  //this.addTalibIndicator('longestEMA', 'ema', {optInTimePeriod : this.settings.longestSize});
  
  log.debug("WMA1 size: "+this.settings.WMA1Size);
  //this.addTalibIndicator('WMA1', 'wma', {optInTimePeriod : this.settings.WMA1Size});
  
  log.debug("SMA1 size: "+this.settings.SMA1Size);
  //this.addTalibIndicator('SMA1', 'sma', {optInTimePeriod : this.settings.SMA1Size});
  
  log.debug("TEMA1 size: "+ this.settings.TEMA1Size);
  //this.addTalibIndicator('TEMA1', 'tema', {optInTimePeriod : this.settings.TEMA1Size});
  
  log.debug("deltaEMA size:"+this.settings.deltaEMASize);
  //this.addTalibIndicator('DeltaEMA', 'dema',{optInTimePeriod : this.settings.DEMASize);


  //Setting up EMA indicators
  log.debug("Shortest EMA size: "+this.settings.shortestSizeEMA);
  log.debug("Short EMA size: "+this.settings.shortSizeEMA);
  log.debug("Long EMA size: "+this.settings.longSizeEMA);
  log.debug("Longest EMA size: "+this.settings.longestSizeEMA);

  
  
  
  
  
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


  var shortestEMA = this.talibIndicators.shortestEMA.result;
  var shortEMA = this.talibIndicators.shortEMA.result;
  var longEMA = this.talibIndicators.longEMA.result;
  var longestEMA = this.talibIndicators.longestEMA.result;
  
  var WMA1 = this.talibIndicators.WMA1.result;
  var TEMA1 = this.talibIndicators.TEMA1.result;
  var SMA1 = this.talibIndicators.SMA1.result;
  var DEMA1 = this.talibIndicators.DEMA1.result;

if (debugMode == true){
    log.debug(shortestEMA + "," + shortEMA + "," + longEMA + "," + longestEMA + "," + WMA1 + "," + TEMA1 + "," + SMA1 + "," + DEMA1);
}  
},

method.check = function(candle) {
 
 method.updateIndicatorResults();
 
  var shortestResult = this.talibIndicators.shortestEMA.result.outReal;
  var shortResult = this.talibIndicators.shortEMA.result.outReal;
  var longResult = this.talibIndicators.longEMA.result.outReal;
  var longestResult = this.talibIndicators.longestEMA.result.outReal;
  var price = candle.close;
  var message = '@ ' + price.toFixed(8);
  
  
  var historicalShortestEmas = new Array();
  var deltas = new Array();
  var lastShortestEma = historicalShortestEmas.get(historicalShortestEmas.length);
  var delta = shortestResult - lastShortestEma;
  
  historicalShortestEmas.push(shortestResult);
  deltas.push(delta);
  
  //if (delta > 0) {
    //shits positive
  } else{
    //negative
  }
  // if this delta is greater than the last
  if(delta > deltas.get(deltas.length)) {
    // slope is increasing
  }

//method.getIndicatorProperty(indicatorName,field)
 
  if((method.getIndicatorProperty('WMA1','delta') > 0) && (method.getIndicatorProperty('WMA2','delta') > 0) && (method.getIndicatorProperty('WMA3','delta') > 0)){
    log.debug('we are currently in uptrend', message);
    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
      lastBuyPrice = 0;
      this.advice('long');
      log.debug("Going to buy");
    } else {
      log.debug("Nothing to buy");
      this.advice();
    }
  } else if((method.getIndicatorProperty('WMA1','delta') < 0){ 
    log.debug('we are currently in a downtrend', message);
    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      lastBuyPrice = this.candle.close;
      this.advice('sell');
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
