class Inverter
{
    constructor(deviceCount)
    {
        this.deviceCount = deviceCount;
    }

    SetData( data )
    {
        this.data = data;
    }
    
    GetTotalEnergyProducedToday()
    {
        if (this.data != null)
        {
            var totalEnergy = 0;
            for (var i = 0; i < this.deviceCount; i++)
            {
                var deviceID = i+1;
                totalEnergy += this.data.Body.DAY_ENERGY.Values[deviceID];
            }

            return totalEnergy;
        }

        return 0;
    }

    GetTotalEnergyProduced()
    {
        if (this.data != null)
        {
            var totalEnergy = 0;
            for (var i = 0; i < this.deviceCount; i++)
            {
                var deviceID = i+1;
                totalEnergy += this.data.Body.TOTAL_ENERGY.Values[deviceID];
            }

            return totalEnergy;
        }

        return 0;
    }

    GetTotalEnergyProducedThisYear()
    {
        if (this.data != null)
        {
            var totalEnergy = 0;
            for (var i = 0; i < this.deviceCount; i++)
            {
                var deviceID = i+1;
                totalEnergy += this.data.Body.YEAR_ENERGY.Values[deviceID];
            }

            return totalEnergy;
        }

        return 0;
    }
}