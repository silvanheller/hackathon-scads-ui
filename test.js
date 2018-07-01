$(document).ready(function() {

    queryDict = {};
    location.search.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    });

    var actor = "1";
    if (queryDict.actor !== undefined) {
        actor = queryDict.actor;
    }

    var religion = "MOS";
    if (queryDict.religion !== undefined) {
        religion = queryDict.religion;
    }

    var measure = "5";
    if (queryDict.measure !== undefined) {
        measure = queryDict.measure;
    }
    measure = parseInt(measure);

    var windowType = "global";
    if (queryDict.windowType !== undefined) {
        windowType = queryDict.windowType;
    }

    var window = "1";
    if (queryDict.window !== undefined) {
        window = queryDict.window;
    }

    var play = "false;"
    if (queryDict.play !== undefined) {
        play = queryDict.play;
    }

    $("#actorDropdown")
        .val(actor)
        .change(function () {
            $("#dropdownform").submit();
        });

    $("#religionDropdown")
        .val(religion)
        .change(function () {
            $("#dropdownform").submit();
    });

    $("#measureDropdown")
        .val(measure)
        .change(function () {
            $("#dropdownform").submit();
        });

    $("#windowDropdown")
        .val(windowType)
        .change(function () {
            $("#dropdownform").submit();
        });

    if(windowType === "global") {
        $("#windowSlider").prop("disabled", true).hide();
        $("#playButton").prop("disabled", true).hide();
    } else {
        $("#windowSlider")
            .val(window)
            .change(function () {
                $("#dropdownform").submit();
            });
        if(play === "true") {
            $("#playButton")
                .val("Stop")
                .click(function () {
                    location.href = "index.html?actor=" + actor + "&religion=" + religion + "&measure=" + measure + "&windowType=" + windowType + "&window=" + window + "&play=false";
                });
        } else {
            $("#playButton")
                .val("Play")
                .click(function () {
                    location.href = "index.html?actor=" + actor + "&religion=" + religion + "&measure=" + measure + "&windowType=" + windowType + "&window=1&play=true";
                });
        }
    }



    var data = [];

    var rawFile = new XMLHttpRequest();
    //country,religionPrefix,actorNumber,count,avgGoldstein,avgAvgTone,quadClass1Percentage,quadClass2Percentage,quadClass3Percentage,quadClass4Percentage,windowIndex,windowStart
    var fileName;
    if(windowType === "global") {
        fileName = "./storage/export_global.csv";
    } else {
        fileName = "./storage/export_"+window+".csv"
    }
    rawFile.open("GET", fileName, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0) {
                var allLines = rawFile.responseText;
                var lines = allLines.split("\n");
                var min = 999999;
                var max = -999999;
                for (var i = 0; i < lines.length; ++i) {
                    //console.log("Line: " + lines[i]);
                    var fields = lines[i].split(",");
                    if (fields[1] === religion && fields[2] === actor) {
                        var value = parseFloat(fields[measure]);
                        data.push([fields[0].toLowerCase(), value]);
                        if (value < min) {
                            min = value;
                        }
                        if (value > max) {
                            max = value;
                        }
                    }
                }
                // For Average Golstein and Average Average Tone the 0 should be in the middle of the color scale
                if (measure === 4 || measure === 5) {
                    if (max > -min) {
                        min = -max;
                    } else {
                        max = -min;
                    }
                }
                console.log("Loaded and parsed CSV file.")

                // Create the chart
                Highcharts.mapChart('container', {
                    chart: {
                        map: 'custom/world-highres2',
                        margin: 40
                    },

                    title: {
                        text: $('#measureDropdown>option:selected').text()+' for '+$('#religionDropdown>option:selected').text()+' and '+$('#actorDropdown>option:selected').text()
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
                        min: min,
                        max: max,
                        type: 'linear',
                        minColor: '#ff0000',
                        maxColor: '#00ff00'
                    },

                    series: [{
                        data: data,
                        name: $('#measureDropdown>option:selected').text()+' for '+$('#religionDropdown>option:selected').text()+' and '+$('#actorDropdown>option:selected').text(),
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
    };
    rawFile.send(null);

    var windowVal = parseInt(window);
    if(play === "true" && windowType === "time" && windowVal < 19) {
        setTimeout(function () {
            var newWindow = windowVal + 1;
            location.href = "index.html?actor=" + actor + "&religion=" + religion + "&measure=" + measure + "&windowType=" + windowType + "&window=" + newWindow + "&play=" + play;
        }, 2000);
    }

});
