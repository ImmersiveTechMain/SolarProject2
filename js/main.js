var SELF = this;
var updateDataRefreshRate = 10 * 1000;

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

var DelayedUpdate = function()
{
    updateTimer.SetDuration(updateDataRefreshRate); 
    productionLabel.SetValue(2 + productionLabel.value * 2);
    bulbsLabel.SetValue(2 + bulbsLabel.value * 2);
    monthTotalLabel.SetValue(2 + monthTotalLabel.value * 2);
    treesLabel.SetValue(2 + treesLabel.value * 2);
    treesSubtitleValueLabel.html(treesLabel.currentlyValueBeingDisplayed);
    co2Label.SetValue(2 + co2Label.value * 2);
    SELF.TestGraph();
}

var SetupDependentVariables = function()
{
    updateTimer = new TimerSlider($("#UpdateBar"), $($("#UpdateTimer").find(".verticalAlign")[0]), this.DelayedUpdate);
}

var Run = function()
{
    this.SetupDependentVariables();
    this.TestGraph();
    this.DelayedUpdate();

    graph.SetTitle("TEST OF A TITLE");
    graph.SetSubtitle("MONTH 99-99");

    setInterval(Update, 1000/60);
}();