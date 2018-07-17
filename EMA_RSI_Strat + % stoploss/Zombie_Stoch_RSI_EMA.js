/*
    EMA RSI Strat
    @author Waves1212
    July 4 2018

    Determine the trend of the market using EMA's Before using the RSI as the main indicator of trades
*/

// req's
var _ = require('lodash');

var log = require ('../core/log.js');
var config = require ('../core/util.js').getConfig();

var RSI = require('./indicators/stochrsi.js');

// Indicators
var longEma = 0;
var shortEma = 0;
var rsi   =   0;
var lastRsi = 0;
var rsiHasBeenBelow = false;
var rsiHasBeenAbove = false;
var tradeFlag = '';  // possible Values : buy , sell , hold

// Strategic Indicators
var emaTrend = '';
var supportLevel = 0
var currentCandlePrice = 0;
var lastBuyPrice = 0;
var stopLossPercent = 0.03;
var sellAtPrice = 0;
var stopLossSold = false;
var historicalCandlePrices = new Array();
// strategy
var strat = {

    /* INIT */
    init: function()
    {
        this.name = 'McKee_EMA_RSI_Strat';
        this.requiredHistory = config.tradingAdvisor.historySize;
        this.debug = true;
        this.twitterNotifPercent =1;
        this.params = this.congigureParams();
        this.congigureTrends();
        stopLossPercent = this.settings.STOP_LOSS_PERCENT;

        this.startTime = new Date();
    },



    //instantiate indicators
    congigureTrends:function(){
        var weight = 10;

        this.addIndicator('longEMA', 'EMA', this.params.EMA_long);
        this.addIndicator('shortEMA', 'EMA', this.params.EMA_short);
        this.addIndicator('rsi', 'RSI', { interval: this.settings.interval });
    },



    congigureParams: function(sentimentPercent){
        return {
            EMA_long:this.settings.EMA_long ,
            EMA_short:this.settings.EMA_short ,

            RSI_HIGH:this.settings.RSI_HIGH ,
            RSI_LOW:this.settings.RSI_LOW ,
        };
    },



    /* RUNS EVERY CANDLE */
    check: function(){

    },


    // ******TODO: stoploss on supportLevel. addd each candle to an array and sort it to see the lowest, highest and the average?

    // TODO: check if the ema's are very close, in this case we might want to consider trading differently
    // TODO: add more emas and do more dank algorithmz with them
    // TODO: laddering trades // this strategy will buy multiple times, presumably attempting to do so with the entire portfolio.
    // TODO: bullinger bands
    // TODO: steepness of the EMA's
    // TODO: forex advanced patterns

    //TODO: make logging clean
    logShit: function() {
    },



    update: function(){

      longEma =  this.indicators.longEMA.result.toFixed(10);
      shortEma = this.indicators.shortEMA.result.toFixed(10);
      rsi   =    this.indicators.rsi.result.toFixed(10);

      // log.debug('calculated EMA & RSI properties for candle:');
      // log.debug('Long EMA    : ' , longEma);
      // log.debug('Short EMA   : ' , shortEma);
      // log.debug('Current RSI : ' , rsi);

      // We are using the EMA trend to check if we should trust the RSI
      tradeFlag = this.checkForRsiCross();

      if(stopLossSold){
        if(longEma < shortEma){
          log.debug('Uptrend detected : allowing buying');
          stopLossSold = false;
        }
        log.debug('waiting for Uptrend');
        return;
      }else{
        this.stopLoss();
      }

      // check if candle length is correct
      if( this.candle.close.length < this.requiredHistory ) {
        log.debug('need more candles');
        return;
      }

      if(tradeFlag == 'HOLD') {
        // log.debug('Holding at' , this.candle.close, '\n')
        // log.debug('Trend : ' , emaTrend);
        return;
      }

      // If the current trend is downward. Allow buying
      if(longEma > shortEma){
        emaTrend = 'DOWN';
        // log.debug('Trend : ' , emaTrend);

        if(tradeFlag == 'BUY' && lastBuyPrice == 0) {
          log.debug('BUYING at' , this.candle.close, '\n')
          lastBuyPrice = this.candle.close;
          this.advice('long');
          return;
        }
      // if the current trend is upward, allow selling.
      // if the trend switches upward and the last sell was due to the stopLoss, allow buying again.
      }else{
        emaTrend = 'UP';
        log.debug('Trend : ' , emaTrend);
        if(tradeFlag == 'SELL') {
          lastBuyPrice = 0;
          log.debug('SELLING at' , this.candle.close , '\n')
          this.advice('short');
          return;
        }
      }
    },


    stopLoss: function(){
      //TODO: if the function has just been called, dont allow buying until the emas cross upwards: this will prevent the bot from riding 3% losses all the way down the downtrend
      // NOTE: this was my first thought on a short term support level, get the lowest candle price from the history and basically see how far we are from it.
      // historicalCandlePrices.push(this.candle.close);
      // historicalCandlePrices.sort();
      // var lowestPrice = historicalCandlePrices[0];
      currentCandlePrice = this.candle.close;
      sellAtPrice = lastBuyPrice - (lastBuyPrice * stopLossPercent);
      // log.debug('Last buy price     : ' , lastBuyPrice);
      // log.debug('currentCandlePrice : ' , currentCandlePrice);
      // log.debug('sellAtPrice        : ' , sellAtPrice);

      if(currentCandlePrice <= sellAtPrice){
        stopLossSold = true;
        lastBuyPrice = 0;
        this.advice('short');
        log.debug('STOP LOSS HIT. SELLING AT : ' , currentCandlePrice);
      }
    },


    checkForRsiCross: function() {
        // If Below
        if(rsi < this.settings.RSI_LOW) {
            rsiHasBeenBelow = true;
            rsiHasBeenAbove = false;
            // log.debug('RSI is below');
            // log.debug('RSI has been above : ' , rsiHasBeenAbove);
            // log.debug('RSI has been below : ' , rsiHasBeenBelow);
            return 'HOLD';
        } else {
            // If Above
            if(rsi > this.settings.RSI_HIGH) {
                rsiHasBeenAbove = true;
                rsiHasBeenBelow = false;
                log.debug('RSI is above');
                // log.debug('RSI has been above : ' , rsiHasBeenAbove);
                // log.debug('RSI has been below : ' , rsiHasBeenBelow);
                return 'HOLD';
            } else {
                // log.debug('RSI is in');
                // log.debug('RSI has been above : ' , rsiHasBeenAbove);
                // log.debug('RSI has been below : ' , rsiHasBeenBelow);
                // if the RSI is in the threshold, check if it has been above or below, this will indicate our cross!
                if(rsiHasBeenAbove) {
                  log.debug('RSI Cross from ABOVE');
                  rsiHasBeenAbove = false;
                  rsiHasBeenBelow = false;
                  return 'SELL';
                }
                if(rsiHasBeenBelow) {
                  log.debug('RSI Cross from BELOW');
                  rsiHasBeenAbove = false;
                  rsiHasBeenBelow = false;
                  return 'BUY';
                }
                rsiHasBeenAbove = false;
                rsiHasBeenBelow = false;
                return 'HOLD';
            }
        }
    },


    /* END backtest */
    end: function(){
        let seconds = ((new Date()- this.startTime)/1000),
            minutes = seconds/60,
            str;
        minutes < 1 ? str = seconds + ' seconds' : str = minutes + ' minutes';

        log.debug('\n\n\n');
        log.debug('BACKTEST COMPLETE');
        log.debug('Finished in ' + str);
        log.debug('\n\n\n');
    }
};

module.exports = strat;
