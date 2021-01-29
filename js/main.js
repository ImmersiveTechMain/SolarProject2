var updateDataRefreshRate = 10 * 1000;

var DelayedUpdate = function(){ updateTimer.SetDuration(updateDataRefreshRate); }
var solarStatustoggle = new DuoToggle( $("#SolarStatusON"), $("#SolarStatusOFF") ,true);
var timer = new TimePrinter($("#DateLabel").find("div.verticalAlign")[0], $("#TimeLabel").find("div.verticalAlign")[0]);
var graph = new Graph($("#WeekGraphTitle"), $("#WeekGraphWeekRange"), $(".graphYValue"), $(".graphBar"));
var updateTimer = new TimerSlider($("#UpdateBar"), $($("#UpdateTimer").find(".verticalAlign")[0]), this.DelayedUpdate);

var TestGraph = function()
{
    var bars = [ new GraphBarData("A", 0.7), new GraphBarData("B", 0.2), new GraphBarData("C", 0.9), new GraphBarData("D", 0.8), new GraphBarData("E", 0.1), new GraphBarData("F", 0), new GraphBarData("G", 1), new GraphBarData("H", 1),new GraphBarData("I", 0.36)];
    graph.SetBarsValues(bars);
}

var Update = function()
{
    timer.Refresh();
    updateTimer.Refresh();
}


var Run = function()
{
    this.TestGraph();
    this.DelayedUpdate();
    setInterval(Update, 1000/60);
}();