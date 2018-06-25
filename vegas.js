/* VEGAS 1.0

Some parameters are not being used

Parameters: 

percentDecreaseToBuy =  0.015
percentIncreaseToSell = 0.015
pastHistory = 15
dipPercent = 3 
risePercent = 3

*/ 
var strat = {};
var buyPrice

var lows = [];
var highs = [];
var starts = [];
var ends = [];

var roundsSinceBuy = 0;

var change_start_end = [];
var change_low = [];
var change_high = [];

var state; 
// 0 for in level dip
//1 for going down
//2 for stable
//3 for rising
//4 for level at top

/*
var avgLow;
var avgHigh;
var avgStart;
var avgEnd;*/

var percentDecreaseToBuy;
var percentIncreaseToSell;
var pastHistory;
var dipPercent;
var risePercent;


// Prepare everything our strat needs
strat.init = function() {
  // setting buy price
  this.requiredHistory = this.settings.pastHistory; // require 5 candles before giving advice
  buyPrice = 0;
  // setting sell price

  percentDecreaseToBuy = this.settings.percentDecreaseToBuy
  percentIncreaseToSell = this.settings.percentIncreaseToSell
  pastHistory = this.settings.pastHistory 
  dipPercent = this.settings.dipPercent 
  risePercent = this.settings.risePercent
   
}


function calculateChanges(data,changes) {
  var count;
  changes = [];
  for(count =1; count < data.length;++count){
     changes[count -1] = (data[count-1] - data [count])/data[count];
  }
}



function sense(){
  var c;

  // Now we know what the overall change was.
  var change_total = (ends[0]-ends[ends.length-1]) / ends[0];

  var change_first_half = (ends[0]-ends[(ends.length-1)/2]) / ends[0]
  var change_second_half = (ends[(ends.length-1)/2]-ends[(ends.length-1)] ) / ends[(ends.length-1)/2];


  
  //for(c = change_start_end.length; c > change_start_end.length/2; ++c){
   // change_total_end += change_start_end;
  //}

  //console.log("change_total is ", change_total);

  if(change_total < -(percentDecreaseToBuy) && change_second_half < 0 ){
    //assume is going down
      state = 1;
  } 

}



// What happens on every new candle?
strat.update = function(candle) {
  // your code!
// it seems as if open doesnt matter because it is the same as close for the previous candle

  if(lows.unshift(candle.low) > this.settings.pastHistory){
    lows.pop();
  }

if(highs.unshift(candle.high) > this.settings.pastHistory){
    highs.pop();
  }
  
  if(starts.unshift(candle.open) > this.settings.pastHistory){
    starts.pop();
  }
  
  //console.log("ends is ", ends.length);

  if(ends.unshift(candle.close) > this.settings.pastHistory){
    ends.pop();

  }

  calculateChanges(ends,change_start_end);
  calculateChanges(highs,change_high);
  calculateChanges(lows,change_low);

  //print("ends ", ends);
  
}


function print(text,arr){
  var c;
for(c=0; c< arr.length; ++c){
  console.log(text,c,":", arr[c]);
}
 

}


// For debugging purposes.
strat.log = function() {
  // your code!
}


// Based on the newly calculate
// information, check if we should
// update or not.
strat.check = function(candle) {
    // buy when it hits buy price

    sense();
        //console.log("STATE IS ", state);

    if(state == 1 && buyPrice == 0) {
        this.advice("long");
        // do some output
        buyPrice = candle.close;
        console.log("buyPrice is ", buyPrice);

        console.log("buying BTC @", candle.close);
        state = -1;
        roundsSinceBuy = 0;
        return;
    } else
    // sell when it hits sell price
    if(buyPrice > 0 && candle.close >= (1+percentIncreaseToSell) * buyPrice){
    
        this.advice("short");
        // do some output
        console.log("selling BTC @", candle.close);
        console.log("selling percent is", (candle.close - buyPrice)/buyPrice);
        buyPrice = 0;
        roundsSinceBuy = 0;
        return;
  } else {
    roundsSinceBuy++;

    if(roundsSinceBuy == 20){
      this.advice("short");
        // do some output
        console.log("selling BTC @", candle.close);
        console.log("selling percent is", (candle.close - buyPrice)/buyPrice);
        buyPrice = 0;
        roundsSinceBuy = 0;
    }
  }
}

module.exports = strat;