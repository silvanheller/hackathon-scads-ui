$(document).ready(function() {

    // http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript/21210643#21210643
    queryDict = {};
    location.search.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    });

    var religion = "MOS";
    if (queryDict.religion !== undefined) {
        religion = queryDict.religion;
    }

    $("#religionDropdown").val(religion);

    $("#religionDropdown").change(function () {
        $("#dropdownform").submit();
    })

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
                    //console.log("Line: " + lines[i]);
                    var fields = lines[i].split(",");
                    if(fields[1] == religion) {
                        // [country, avgAvgTone]
                        var value = parseFloat(fields[5]);
                        data.push([fields[0].toLowerCase(), value]);
                    }
                }
                console.log("Loaded and parsed CSV file.")

                // Create the chart
                Highcharts.mapChart('container', {
                    chart: {
                        map: 'custom/world-highres2',
                        height: 800,
                        width: 1900
                    },

                    title: {
                        text: 'AvgAvgTone for religion='+religion+' and arbitrary actorNum'
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
                        type: 'linear',
                        minColor: '#ff0000',
                        maxColor: '#00ff00'
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

});
