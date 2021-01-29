class Graph
{
    constructor( titleLabel, subtitleLabel, originalVerticalLine, originalBar)
    {
        this.titleLabel = titleLabel;
        this.subtitleLabel = subtitleLabel;
        this.originalVerticalLine = originalVerticalLine;
        this.originalBar = originalBar;
        
        /* assuming it is in % */
        var maxWidth = originalBar.css("max-width");
        maxWidth = maxWidth.substring(0, maxWidth.length - 1);
        this.maxWidthPerBar = maxWidth;
        this.maxBarCountAllowed = Math.floor(100 / this.maxWidthPerBar); 
        this.minBarCountAllowed = 7; // by design
        this.maxSpacing = this.CalculateSpacingPerBar(this.minBarCountAllowed, this.maxWidthPerBar);
        this.minSpacing = 0;

        this.bars = [];
        this.yValues = [];

        this.originalBar.hide();
        this.originalVerticalLine.hide();        
    }
    
    CalculateSpacingPerBar(numberOfBars, barThickness)
    {
        return (100 - numberOfBars * barThickness) / (numberOfBars + 1);
    }

    SetBarsValues(valuesArray)
    {
        var normal = (valuesArray.length - this.minBarCountAllowed) / (this.maxBarCountAllowed - this.minBarCountAllowed); // from 0 to 1 the width of a single bar where 1 is 0 width and 1 is maxWidth
        normal = normal < 0 ? 0 : (normal > 1 ? 1 : normal);

        var widthPerBar = (1-normal) * this.maxWidthPerBar;
        var spacing = this.CalculateSpacingPerBar(valuesArray.length, widthPerBar);

        for (var i = 0; i < Math.max(this.bars.length, valuesArray.length); i++)
        {
            var validValue = i < valuesArray.length;
            var barExists = i < this.bars.length && this.bars[i] != null;
            if (validValue)
            {
                var bar = this.bars[i];
                if (!barExists)    
                {
                    bar = this.CreateBar(valuesArray[i].value , valuesArray[i].name);
                    this.bars[i] = bar;
                }
                bar.SetName(valuesArray[i].name);
                bar.SetValue(valuesArray[i].value);

                var barMarginLeft = spacing + (i * (spacing + widthPerBar));

                bar.bar.css("width" , (widthPerBar + "%"));
                bar.bar.css("margin-left", (barMarginLeft + "%"));
            }
            else
            {
                if (barExists) { this.bars[i].Destroy(); this.bars[i] = null; }
            }
        }
    }
    
    CreateYValue(value, position)
    {
        var visual = this.originalVerticalLine.clone();
        visual.show();
        this.originalVerticalLine.parent().append(visual);
        var result = new GraphYValue(visual, value);
        result.SetValue(value);
        result.SetHeight(position);
        return result;
    }

    CreateBar(value, name)
    {
        var visual =this.originalBar.clone();
        visual.show();
        this.originalBar.parent().append(visual);
        var result = new GraphBar(visual, name);
        result.SetValue(value);
        return result;
    }
}

class GraphBarData
{
    constructor(name, value)
    {   
        this.name = name;
        this.value = value;
    }
}