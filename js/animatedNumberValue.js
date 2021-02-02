class AnimatedValue
{
	constructor(label, changeDuration)
	{
		this.label = label;
		this.changeDuration = changeDuration;
		this.value = 0;
		this.previousValue = 0;
		this.timeStamp = 0;
		this.currentlyValueBeingDisplayed = 0;
		this.Refresh();
	}

	SetValue(value)
	{
		this.previousValue = this.value;
		this.value = value;
		this.timeStamp = (new Date()).getTime();
		this.Refresh();
	}

	Refresh()
	{
		var date = new Date();
		var timePassed = date.getTime() - this.timeStamp;
		timePassed = timePassed < 0 ? 0 : (timePassed > this.changeDuration*1000 ? this.changeDuration*1000 : timePassed);
		var normalized = timePassed / (this.changeDuration*1000);
		var value = this.previousValue + (this.value - this.previousValue) * normalized;
		value = Math.round(value);
		this.currentlyValueBeingDisplayed = value;
		this.label.html(value);
	}
}