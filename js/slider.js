class Slider
{
    constructor(bar)
    {
        this.bar = bar;
    }

    SetValue( v ) 
    {
        this.bar.css("clip-path", "inset(0% "+(((1-v)*100) + "%")+" 0% 0%)");
    }
}

class TimerSlider
{   
    constructor(bar, label, onFinished)
    {
        this.running = false;
        this.bar = new Slider(bar);
        this.label = label;
        this.onFinished = onFinished;
    }

    SetDuration(duration) 
    {
        var date = new Date();
        
        this.running = true;
        this.timeStamp = date.getTime();
        this.duration = duration;

        this.Refresh();
    }

    Refresh()
    {        
        if (this.running)
        {
            var date = new Date();
            var timePassed = date.getTime() - this.timeStamp; 
            var millisecondsReminding =  this.duration - timePassed; 
            millisecondsReminding = millisecondsReminding < 0 ? 0 : (millisecondsReminding > this.duration ? this.duration : millisecondsReminding);
        
            var sec = Math.floor(millisecondsReminding / 1000);

            this.label.html((sec < 10 ? "0" : "") + sec + ":" + (( millisecondsReminding - sec*1000 ) * 60).toString().substring(0,2) );
            this.bar.SetValue(millisecondsReminding / this.duration);    
            if (millisecondsReminding == 0)
            {
                this.isRunning = false; 
                this.onFinished(); 
            }
        }
    }
}