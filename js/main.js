var SELF = this;
var INVERTER_DEVICE_COUNT = 8;

var updateDataRefreshRate = 10 * 1000;

var inverter = new Inverter(INVERTER_DEVICE_COUNT);
var solarStatustoggle = new DuoToggle( $("#SolarStatusON"), $("#SolarStatusOFF") ,true);
var timer = new TimePrinter($("#DateLabel").find("div.verticalAlign")[0], $("#TimeLabel").find("div.verticalAlign")[0]);
var graph = new Graph($("#WeekGraphTitle"), $("#WeekGraphWeekRange"), $(".graphYValue"), $(".graphBar"));
var updateTimer; /* has to be defined later in order for the callback to recognize the function ( because the function is being defined after this definition) */
var productionLabel = new AnimatedValue( $($("#ProductionLabel").find(".focusedValue")[0]), 1.6);
var bulbsLabel = new AnimatedValue($($("#BulbsLabel").find(".focusedValue")[0]), 1.6);
var monthTotalLabel = new AnimatedValue($($("#MonthTotalLabel").find(".focusedValue")[0]), 1.6);
var treesLabel = new AnimatedValue($($("#TreesValue").find(".verticalAlign")[0]), 1.6);
var treesSubtitleValueLabel = $($("#TreesSubtitles").find(".text")[0]);
var co2Label = new AnimatedValue($($("#Co2Value").find(".text")[0]), 1.6);


var TestGraph = function()
{
    var bars = [ new GraphBarData("A", Math.random()), new GraphBarData("B", Math.random()), new GraphBarData("C", Math.random()), new GraphBarData("D", Math.random()), new GraphBarData("E", Math.random()), new GraphBarData("F", Math.random()), new GraphBarData("G", Math.random())];
    graph.SetUnit("AC");
    graph.SetBarsValues(bars);
    graph.SetYValues(2300, bars.length);
}

var ApplyWeekDataToGraph = function(data)
{
    if (data != null)
    {
        var bars = 
        [ 
            new GraphBarData("Sunday", 0),
            new GraphBarData("Monday", 0,), 
            new GraphBarData("Tuesday", 0), 
            new GraphBarData("Wednesday", 0),
            new GraphBarData("Tuesday", 0), 
            new GraphBarData("Friday", 0),
            new GraphBarData("Saturday", 0)
        ];
        
        var maxEnergyRegistered = 0;
        var todayDate = null;
        var oldestDayDate = null;

        if (data.days != undefined)
        {
            for (var i = 0; i < data.days.length; i++)
            {
                var thatDayInverter = new Inverter(INVERTER_DEVICE_COUNT);
                var thatDayEnergy = 0;
                var barIndex = data.startingDayOfWeekIndex - i;
                if (barIndex < 0) { barIndex += bars.length; }

                if (data.days[i] != null)
                {
                    if (i == 0) 
                    {
                        todayDate = new Date(data.days[i].Head.Timestamp);
                    }
                    oldestDayDate = new Date(data.days[i].Head.Timestamp);

                    thatDayInverter.SetData(data.days[i]);
                    thatDayEnergy = thatDayInverter.GetTotalEnergyProducedToday() / 1000; // we divided by 1000 to transform from Wh to KWh
                    if (thatDayEnergy > maxEnergyRegistered)
                    {
                        maxEnergyRegistered = thatDayEnergy;
                    }
                }

                bars[barIndex].value = thatDayEnergy;
                bars[barIndex].SetTransparentMode(barIndex > data.startingDayOfWeekIndex);
            }
        }

        for (var i = 0; i < bars.length; i++)
        {
            bars[i].value =   bars[i].value /  maxEnergyRegistered; // normalize values
        }

        graph.SetUnit("KWh");
        graph.SetBarsValues(bars);
        graph.SetYValues(maxEnergyRegistered, bars.length);
        
        var month = todayDate == null ? "" : timer.GetMonthName(todayDate.getMonth());
        var fromDate = oldestDayDate == null ? "" : oldestDayDate.getDate();
        var toDate = todayDate == null ? "" : todayDate.getDate();
        toDate = toDate == fromDate ? "" : toDate;
        var thereAre2DifferentDates =  fromDate != "" && toDate != "";

        graph.SetSubtitle((month + " " + fromDate + (thereAre2DifferentDates ? "-" : "") + toDate).toUpperCase());
    }
}

var Update = function()
{
    timer.Refresh();
    updateTimer.Refresh();
    productionLabel.Refresh();
    bulbsLabel.Refresh();
    monthTotalLabel.Refresh();
    treesLabel.Refresh();
    treesSubtitleValueLabel.html(treesLabel.currentlyValueBeingDisplayed);
    co2Label.Refresh();
}

var GetDataFromServer = function()
{
    var form = 
    {
        "Action": "GetData"
    };

    $.post("../server/server.php", form, function( response )
    {
        var valid = response != undefined && response != null && response != "null";
        if (valid)
        {
            var data = JSON.parse(response);
            inverter.SetData(data);
            SELF.ApplyData(data);
        }
    });

    var form2 = 
    {
        "Action": "GetWeekReport"
    };

    $.post("../server/server.php", form2, function( response )
    {
        var valid = response != undefined && response != null && response != "null";
        if (valid)
        {
            var data = JSON.parse(response);
            if (data != null && data.days != undefined)
            {
                for (var i = 0; i < data.days.length; i++)
                {
                    var validDataPiece = data.days[i] != null && data.days[i] != "null";
                    data.days[i] = validDataPiece ? JSON.parse(data.days[i]) : null;
                }
            
                SELF.ApplyWeekDataToGraph(data);
            }
        }
    });

    var form3 = 
        {
            "Action": "GetTotalMonthEnergy"
        };

        $.post("../server/server.php", form3, function( response )
        {
            var valid = response != undefined && response != null && response != "null";
            if (valid)
            {
                var data = JSON.parse(response);
                if (data != null)
                {
                    var totalEnergyThisMonth = data / 1000; // transform to kh
                    monthTotalLabel.SetValue(totalEnergyThisMonth);
                }
            }
        });
}

var ApplyData = function(data)
{
    var totalEnergyProducedToday = inverter.GetTotalEnergyProducedToday(); // wh (watts per hour) (the avarage energy over an hour)
    var totalEnergyProducedToday_KW = totalEnergyProducedToday / 1000;
    var lightBulbsLighted = Math.floor( totalEnergyProducedToday / 60 );

    var poundsToKG = 0.453592;
    var co2PerKwh = (0.92 * poundsToKG); // 0.92 punds, 
    var co2AbsorbtionOfATreeInAYear = (48 * poundsToKG);
    var energyOfATree = co2AbsorbtionOfATreeInAYear / co2PerKwh;
    var trees = Math.floor(totalEnergyProducedToday_KW / energyOfATree);

    productionLabel.SetValue(totalEnergyProducedToday);
    bulbsLabel.SetValue(lightBulbsLighted);
    treesLabel.SetValue(trees);
    treesSubtitleValueLabel.html(treesLabel.currentlyValueBeingDisplayed);
    co2Label.SetValue(totalEnergyProducedToday_KW);
}

var DebugValuesChanging = function()
{
    productionLabel.SetValue(2 + productionLabel.value * 2);
    bulbsLabel.SetValue(2 + bulbsLabel.value * 2);
    monthTotalLabel.SetValue(2 + monthTotalLabel.value * 2);
    treesLabel.SetValue(2 + treesLabel.value * 2);
    treesSubtitleValueLabel.html(treesLabel.currentlyValueBeingDisplayed);
    co2Label.SetValue(2 + co2Label.value * 2);
    SELF.TestGraph();
}

var DelayedUpdate = function()
{
    SELF.GetDataFromServer();
    //SELF.DebugValuesChanging();
    updateTimer.SetDuration(updateDataRefreshRate);
}

var SetupDependentVariables = function()
{
    updateTimer = new TimerSlider($("#UpdateBar"), $($("#UpdateTimer").find(".verticalAlign")[0]), this.DelayedUpdate);
}

var Run = function()
{
    this.SetupDependentVariables();
    this.DelayedUpdate();

    graph.SetTitle("ENERGY PRODUCED THIS WEEK");

    setInterval(Update, 1000/60);
}();