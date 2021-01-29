class GraphYValue
{
    constructor(line, value)
    {
        this.line = line;
        this.label = $(line.find(".graphYValue_Label .verticalAlign")[0]);
        this.label.html(value);
        this.exists = true;
    }

    SetValue( n )
    {
        this.label.html(n);
    }

    SetHeight(n)
    {
        this.line.css("bottom" , (n * 100) + "%");
    }

    Destroy()
    {
        this.line.remove();
        this.exists = false;
    }
}