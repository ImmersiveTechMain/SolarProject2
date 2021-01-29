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

    Destroy()
    {
        this.bar.remove();
        this.exists = false;
    }
}