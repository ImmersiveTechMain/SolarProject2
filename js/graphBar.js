class GraphBar
{
    constructor(bar, name)
    {
        bar.show();
        this.bar = bar;
        this.label = $(bar.find(".graphBarLabel .verticalAlign")[0]);
        this.SetName(name);
        this.exists = true;
    }

    SetName( name )
    {
        this.name = name;
        this.label.html(name);   
    }

    SetValue(n)
    {
        this.bar.css("height", ((n * 100) + "%") );
    }

    SetTransparentMode(isTransparent)
    {
        var className = "transparentBar";
        if (isTransparent)
        {
            this.bar.addClass(className);
        }   
        else
        {
            this.bar.removeClass(className);
        }
    }

    Destroy()
    {
        this.bar.remove();
        this.exists = false;
    }
}