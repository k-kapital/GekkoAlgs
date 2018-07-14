/*
    EMA RSI Strat
    @author Alexander McKee
    July 4 2018

    Determine the trend of the market using EMA's Before using the RSI as the main indicator of trades
*/

// req's
var _ = require('lodash');

var log = require ('../core/log.js');
var config = require ('../core/util.js').getConfig();

var RSI = require('./indicators/RSI.js');

// Indicators
var longEma = 0;
var shortEma = 0;
var rsi   =   0;
var lastRsi = 0;
var rsiHasBeenBelow = false;
var rsiHasBeenAbove = false;
// buy , sell , hold
var tradeFlag = '';
// Strategic Indicators
var emaTrend = '';
//var historicalCandlePrices = new Array("HI");
var supportLevel = 0
var boughtAt = 0;
var soldAt = 0;
var candleCount = 0
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

        this.startTime = new Date();
    },

    //instantiate indicators
    congigureTrends:function(){
        var weight = 10;

        this.addIndicator('longEMA', 'EMA', this.params.EMA_long);
        this.addIndicator('shortEMA', 'EMA', this.params.EMA_short);
        this.addIndicator('rsi', 'RSI', this.settings );
    },

    congigureParams: function(sentimentPercent){
        return {
            EMA_long:this.settings.EMA_long ,
            EMA_short:this.settings.EMA_short ,

            RSI_HIGH:this.settings.RSI_HIGH ,
            RSI_LOW:this.settings.RSI_LOW ,
        };
    },

    update: function(){

      longEma =  this.indicators.longEMA.result.toFixed(10);
      shortEma = this.indicators.shortEMA.result.toFixed(10);
      rsi   =    this.indicators.rsi.result.toFixed(10);

      // historicalCandlePrices.push(this.candle.close);
      // //historicalCandlePrices.sort();
      // supportLevel = historicalCandlePrices[0];
      // log.debug(historicalCandlePrices);

      log.debug('calculated EMA & RSI properties for candle:');
      log.debug('Long EMA    : ' , longEma);
      log.debug('Short EMA   : ' , shortEma);
      log.debug('Current RSI : ' , rsi);
      log.debug('\n');
    },


    /* CHECK */
    check: function(){
        // We are using the EMA trend to check if we should trust the RSI
        tradeFlag = this.checkForRsiCross();

        // check if candle length is correct
        if( this.candle.close.length < this.requiredHistory ) {
          log.debug('need more candles');
          return;
        }

        // ******TODO: stoploss on supportLevel. addd each candle to an array and sort it to see the lowest, highest and the average?

        // TODO: check if the ema's are very close, in this case we might want to consider trading differently
        // TODO: add more emas and do more dank algorithmz with them
        // TODO: laddering trades // this strategy will buy multiple times, presumably attempting to do so with the entire portfolio.
        // TODO: bullinger bands
        // TODO: steepness of the EMA's
        // TODO: forex advanced patterns

        if(tradeFlag == 'HOLD') {
          log.debug('Holding at' , this.candle.close)
          return;
        }
        // If the current trend is downward. Allow buying
        if(longEma > shortEma){
          emaTrend = 'DOWN';

          if(tradeFlag == 'BUY') {
            log.debug('Buying at' , this.candle.close)
            this.advice('long');
          }
        // if the current trend is upward, allow selling.
        }else{
          emaTrend = 'UP';

          if(tradeFlag == 'SELL') {
            log.debug('Selling at' , this.candle.close)
            this.advice('short');
          }
        }
    }, // check()

    checkForRsiCross: function() {

      log.debug(rsiHasBeenAbove);
      log.debug(rsiHasBeenBelow);
        // If Below
        if(rsi < this.settings.RSI_LOW) {
            rsiHasBeenBelow = true;
            rsiHasBeenAbove = false;
            log.debug('RSI is below');
            return 'HOLD';
        } else {
            // If Above
            if(rsi > this.settings.RSI_HIGH) {
                rsiHasBeenAbove = true;
                rsiHasBeenBelow = false;
                log.debug('RSI is above');
                return 'HOLD';
            } else {

                log.debug('RSI is in');
                // if the RSI is in the threshold, check if it has been above or below, this will indicate our cross!
                if(rsiHasBeenAbove) {
                  log.debug('RSI Cross from ABOVE');
                  return 'SELL';
                }
                if(rsiHasBeenBelow) {
                  log.debug('RSI Cross from BELOW');
                  return 'BUY';
                }
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
