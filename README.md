# GekkoAlgs

The Gekko object contains most of the data that we will be working with. When a new candle is formed, the "update()' and "check()" functions are called. 

The theme of most strategies is to use "check()" to do most of the logic, and "update()" to log useful information.

please forgive the formatting. github reads code like a 6th grade schoolgirl.

The Gekko object Contains this:

2018-07-09 15:19:13 (DEBUG):    Selling at Base {

 {
  settings:
   { EMA_short: 30,    // Variables decleared in the .toml file associated with the strategy
	 
     EMA_long: 60,	 
		 
     RSI_HIGH: 70,
		 
     RSI_LOW: 30,
		 
     interval: 14 },  // RSI candle size
		 
  tradingAdvisor:
	
   { enabled: true,
	 
     method: 'McKee_EMA_RSI_Strat',
		 
     candleSize: 15,
		 
     historySize: 34 },
		 
  requiredHistory: 34,
	
  priceValue: 'close',
	
  indicators:
   { longEMA:                         // These are only the indicators that I have added for my EMA + RSI strat. see the indicators page on gekkos website
	 
      Indicator {                     // https://gekko.wizb.it/docs/strategies/gekko_indicators.html
			
        input: 'price',               // ^^ these are only the out of the box indicators, see the Talib and Tulip page as well, those are all at our disposal
				
        weight: 60,
				
        result: 450.54781541072083,
				
        age: 191 },
				
     shortEMA:
		 
      Indicator {
			
        input: 'price',
				
        weight: 30,
				
        result: 450.11194251896904,
				
        age: 191 },
				
     rsi:
		 
      Indicator {
			
        input: 'candle',
				
        lastClose: 448.13462455,
				
        weight: 14,
				
        avgU: [Object],
				
        avgD: [Object],
				
        u: 1.1346245500000123,
				
        d: 0,
				
        rs: 0.7388551901297588,
				
        result: 42.49089828317579,
				
        age: 191 } ,
				
  talibIndicators: {},
	
  tulipIndicators: {},
	
  asyncTick: false,
	
  candlePropsCacheSize: 1000,
	
  deferredTicks: [],
	
  candleProps:
	
   { open: [],
	 
     high: [],
		 
     low: [],
		 
     close: [],
		 
     volume: [],
		 
     vwp: [],
		 
     trades: [] },
		 
  onTrade: [Function],
	
  name: 'McKee_EMA_RSI_Strat',
	
  debug: true,
	
  twitterNotifPercent: 1,
	
  params: { EMA_long: 60, EMA_short: 30, RSI_HIGH: 70, RSI_LOW: 30 },
	
  startTime: 2018-07-09T22:19:12.055Z,
	
  log: [Function],
	
  hasSyncIndicators: true,
	
  _events: { advice: [Function: bound], trade: [Function: bound] },
	
  _eventsCount: 2,
	
  candle:                                         // Candle properties:  ive seen more here before
	
   { id: 43264,                                   // I think you can see each trade and for how much somehow idk if that is useful in any way?
	 
     start: moment("2018-07-01T22:10:00.000"),
		 
     open: 446.90402198,
		 
     high: 448.13462455,
		 
     low: 446.9,
		 
     close: 448.13462455,
		 
     vwp: 447.0609796087936,
		 
     volume: 30.37610565,
		 
     trades: 151 },
		
		}
