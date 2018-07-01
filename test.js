actor = "1";
religion = "MOS";
measure = 5;
usedWindowType = "global";
usedWindowIndex = "1";
play = "false";

data = [];
min = undefined;
max = undefined;
chart = undefined;
playInterval = undefined;

lastLoadedMeasure = undefined;

$(document).ready(function() {

    $("#actorDropdown")
        .val(actor)
        .change(function () {
            actor = $("#actorDropdown").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
        });

    $("#religionDropdown")
        .val(religion)
        .change(function () {
            religion = $("#religionDropdown").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
    });

    $("#measureDropdown")
        .val(measure)
        .change(function () {
            measure = parseInt($("#measureDropdown").prop("value"));
            var fileName = generateFileName();
            loadData(fileName);
        });

    $("#windowDropdown")
        .val(usedWindowType)
        .change(function () {
            usedWindowType = $("#windowDropdown").prop("value");
            if(usedWindowType === "global") {
                $("#windowSlider").prop("disabled", true).hide();
                $("#playButton").prop("disabled", true).hide();
            } else {
                $("#windowSlider").prop("disabled", false).show();
                $("#playButton").prop("disabled", false).show();
            }
            var fileName = generateFileName();
            loadData(fileName);
        });

    $("#windowSlider")
        .val(usedWindowIndex)
        .change(function () {
            usedWindowIndex = $("#windowSlider").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
        });

    $("#playButton")
        .click(function () {
            if(play === "true") {
                console.log("ho");
                $("#playButton").val("Play");
                play = "false";
            } else {
                console.log("hui");
                $("#playButton").val("Stop");
                usedWindowIndex = "1";
                $("#windowSlider").val(usedWindowIndex)
                play = "true";

                playInterval = setInterval(function () {
                    var usedWindowIndexVal = parseInt(usedWindowIndex);
                    if(usedWindowIndexVal > 19) {
                        clearInterval(playInterval);
                    }
                    newUsedWindowIndexVal = usedWindowIndexVal+1;
                    usedWindowIndex = newUsedWindowIndexVal.toString();
                    $("#windowSlider").val(usedWindowIndex)
                    var fileName = generateFileName();
                    loadData(fileName);
                }, 700);
            }
            var fileName = generateFileName();
            loadData(fileName);
        });

    if(usedWindowType === "global") {
        $("#windowSlider").prop("disabled", true).hide();
        $("#playButton").prop("disabled", true).hide();
    } else {
        if(play === "true") {
            $("#playButton").val("Stop");
        } else {
            $("#playButton").val("Play");
        }
    }

    var fileName = generateFileName();
    loadData(fileName);
});

function generateFileName() {
    var fileName;
    if(usedWindowType === "global") {
        fileName = "./storage/export_global.csv";
    } else {
        fileName = "./storage/export_"+usedWindowIndex+".csv"
    }
    console.log(fileName);
    return fileName;
}

function loadData(fileName) {
    var rawFile = new XMLHttpRequest();
    //country,religionPrefix,actorNumber,count,avgGoldstein,avgAvgTone,quadClass1Percentage,quadClass2Percentage,quadClass3Percentage,quadClass4Percentage,windowIndex,windowStart
    rawFile.open("GET", fileName, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0) {
                parseCSV(rawFile.responseText);
                if(chart === undefined || lastLoadedMeasure !== measure) {
                    initHighchart();
                } else {
                    chart.series[0].setData(data);
                }
            }
        }
    };
    rawFile.send(null);
    lastLoadedMeasure = measure;
}

function parseCSV(allLines) {
    min = 999999;
    max = -999999;
    var lines = allLines.split("\n");
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
}

function initHighchart() {
    chart = Highcharts.mapChart('container', {
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
