class TimePrinter
{
    constructor(dateLabel, timeLabel)
    {
        this.timeLabel = $(timeLabel);
        this.dateLabel = $(dateLabel);
        this.Refresh();        
    }

    Refresh()
    {
        var date = new Date();
        var hours = date.getHours();        
        var dayTime = hours > 12 ? "PM" : "AM";
        hours = hours % 12;


        $(this.timeLabel.find(".text")[0]).html(hours + ":" + ((date.getMinutes()<10?'0':'') + date.getMinutes()) + ":" + ( (date.getSeconds()<10?'0':'') + date.getSeconds()) );
        var ampm = $(this.timeLabel.find(".smallerText")[0]);        
        ampm.html(dayTime);
        
        
        this.dateLabel.html( this.GetMonthName(date.getMonth()).toUpperCase() + " " + date.getDate() + ", " + date.getFullYear());
    }

    GetDayName(dayIndex)
    {
        var days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
        return days[dayIndex];
    }

    GetMonthName(monthIndex)
    {
        var month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        return month[monthIndex];
    }
}