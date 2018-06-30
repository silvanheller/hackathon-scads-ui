var data = [];

var rawFile = new XMLHttpRequest();
//country,religionPrefix,actorNumber,count,avgGoldstein,avgAvgTone,sumQuadClass1,sumQuadClass2,sumQuadClass3,sumQuadClass4
rawFile.open("GET", "./export.csv", false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            var allLines = rawFile.responseText;
            var lines = allLines.split("\n");
            for(var i=0; i<lines.length; ++i) {
                console.log("Line: " + lines[i]);
                var fields = lines[i].split(",");
                if(fields[1] == "CHR") {
                    // [country, avgAvgTone]
                    var value = parseFloat(fields[5]);
                    data.push([fields[0].toLowerCase(), value]);
                }
            }

            // Create the chart
            Highcharts.mapChart('container', {
                chart: {
                    map: 'custom/world-highres2',
                    height: 800,
                    width: 1900
                },

                title: {
                    text: 'AvgAvgTone for religion=CHR and arbitrary actorNum'
                },

                /*subtitle: {
                    text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-highres2.js">World, Miller projection, very high resolution</a>'
                },*/

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                colorAxis: {
                    /*minColor: 'red',
                    maxColor: 'green'*/
                },

                series: [{
                    data: data,
                    name: 'Random data',
                    states: {
                        hover: {
                            color: '#BADA55'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }]
            });

        }
    }
}
rawFile.send(null);