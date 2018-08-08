// Source: https://raw.githubusercontent.com/vrfurl/gekko/stable/strategies/EMACrossover.js
// Downloaded from: https://github.com/xFFFFF/Gekko-Strategies
// helpers
var _ = require('lodash');
var log = require('../core/log.js');
var stopLossSold = false;
var lastBuyPrice = 0;
var stopLossPercent = 0.03;
var debugMode = false
var count = 0;
var indicatorData = {};
// let's create our own method
var method = {};
var thisPointer;
  method.addIndicatorCustom=function(name,type,optTimePeriod){
  indicatorData [name] = {indicatorName:type,optInTimePeriod: optTimePeriod};
  thisPointer.addTalibIndicator(name, indicatorData[name].indicatorName, {optInTimePeriod : indicatorData[name].optInTimePeriod});
  method.addIndicatorProperty(name,'indicator',thisPointer.talibIndicators[name])

};

method.addIndicatorProperty=function(indicatorName,fieldName,valueToInsert){

  Object.defineProperty(indicatorData[indicatorName],fieldName,{value: valueToInsert, writable: true});


};

method.getIndicatorProperty=function(indicatorName,field){
    return indicatorData[indicatorName][field];
};

method.updateIndicatorResults = function(){
for (var property in indicatorData) {
    if (indicatorData.hasOwnProperty(property)) {
        var newResult = thisPointer.talibIndicators[property].result.outReal;
           // log.debug(newResult);

        if(!indicatorData[property].hasOwnProperty('delta')){
            method.addIndicatorProperty(property,'delta', 0);
        }else{
            method.addIndicatorProperty(property,'delta', newResult - indicatorData[property].result );
        }
            method.addIndicatorProperty(property,'result',newResult);

    }
}
};

method.printData = function(){
  var output = count.toString();
  for (var property in indicatorData) {
    output = output + "," + property + "," + method.getIndicatorProperty(property,'result') + "," + method.getIndicatorProperty(property,'delta') ;
  }
    log.debug(output);

}


// prepare everything our method needs
method.init = function() {
  thisPointer = this;
  count = 0;
  this.name = '4EMACrossover';
  this.currentTrend;
  this.requiredHistory = 0;
  
  //Here we define indicators
   method.addIndicatorCustom('WMA1','wma',this.settings.WMA1Size);
   method.addIndicatorCustom('WMA2','wma',this.settings.WMA2Size);
   method.addIndicatorCustom('WMA3','wma',this.settings.WMA3Size);
   //method.addIndicatorCustom('DELTAEMA1',[NEEDS TO BE DEFINED,this.settings.DELTAEMA1Size);

 
  log.debug(this.name+' Strategy initialized');
},

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
},

method.check = function(candle) {

 method.updateIndicatorResults();
 method.printData();
 count = count + 1;
  var price = candle.close;
  var message = '@ ' + price.toFixed(8);

  if((method.getIndicatorProperty('WMA1','delta') > 0) && (method.getIndicatorProperty('WMA2','delta') > 0) && (method.getIndicatorProperty('WMA3','delta') > 0)){
    //log.debug('we are currently in uptrend', message);
    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
      this.advice('long');
      log.debug("Going to buy");
    } else {
      log.debug("Nothing to buy");
      this.advice();
    }
  } else if((method.getIndicatorProperty('WMA1','delta')) < 0){
    //log.debug('we are currently in a downtrend', message);
    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      lastBuyPrice = this.candle.close;
      this.advice('sell');
      log.debug("Going to sell");
    } else
      log.debug("Nothing to sell");
      this.advice();
  } else {
    //log.debug('we are currently not in an up or down trend', message);
    this.advice();
  }
},

module.exports = method;
