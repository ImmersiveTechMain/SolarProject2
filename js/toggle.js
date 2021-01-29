class Toggle 
{
    constructor (divObject, initialValue)
    {
        this.onTag = "toggle_on";
        this.offTag = "toggle_off";
        this.isOn = false;
        this.divObject = divObject;

        this.SetValue(initialValue);
    }

    SetValue( val )
    {
        this.isOn = val;
        this.divObject.removeClass(this.onTag);
        this.divObject.removeClass(this.offTag);
        this.divObject.addClass(this.isOn ? this.onTag : this.offTag);
    }
}

class DuoToggle
{
    constructor(divObject_ON, divObject_OFF, initialValue)
    {
        this.OnToggle = new Toggle(divObject_ON, initialValue);
        this.OffToggle = new Toggle(divObject_OFF, !initialValue);
    }

    SetValue( val )
    {
        this.OnToggle.SetValue(val);
        this.OffToggle.SetValue(!val)
    }
}