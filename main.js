/**
 * Default values
 */
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

timeMeasurementHelper = 0;

$(document).ready(function() {

    /**
     * Sets actorDropdown to default value and set change function.
     */
    $("#actorDropdown")
        .val(actor)
        .change(function () {
            actor = $("#actorDropdown").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
        });

    /**
     * Sets religionDropdown to default value and set change function.
     */
    $("#religionDropdown")
        .val(religion)
        .change(function () {
            religion = $("#religionDropdown").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
    });

    /**
     * Sets measureDropdown to default value and set change function.
     */
    $("#measureDropdown")
        .val(measure)
        .change(function () {
            measure = parseInt($("#measureDropdown").prop("value"));
            var fileName = generateFileName();
            loadData(fileName);
        });

    /**
     * Sets windowDropdown to default value and set change function.
     */
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

    /**
     * Sets windowSlider to default value and set change function.
     */
    $("#windowSlider")
        .val(usedWindowIndex)
        .change(function () {
            usedWindowIndex = $("#windowSlider").prop("value");
            var fileName = generateFileName();
            loadData(fileName);
        });

    /**
     * Added play/stop button functionality.
     */
    $("#playButton")
        .click(function () {
            if(play === "true") {
                $("#playButton").val("Play");
                play = "false";
                clearInterval(playInterval);
                // TODO: repair stop button
            } else {
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

    /**
     * Hide windowSlider and playButton if windowType default is global and set proper text for play button if windowType default is not global.
     */
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

    /**
     * Create first chart for default values.
     */
    var fileName = generateFileName();
    loadData(fileName);
});

/**
 * Generates file name using the global variables.
 * @returns {string}
 */
function generateFileName() {
    var fileName;
    if(usedWindowType === "global") {
        fileName = "./storage/export_global.csv";
    } else {
        fileName = "./storage/export_"+usedWindowIndex+".csv"
    }
    return fileName;
}

/**
 * Generates chart title using the global variables.
 * @returns {string}
 */
function generateChartTitle() {
    var chartTitle = $('#measureDropdown>option:selected').text()+' for '+$('#religionDropdown>option:selected').text()+', '+$('#actorDropdown>option:selected').text();
    if(usedWindowType === "global") {
        chartTitle += " and Global";
    } else {
        chartTitle += " and ";
        chartTitle += usedWindowIndex;
        if(usedWindowIndex.substr(usedWindowIndex.length-1,1) === "1" && usedWindowIndex !== "11") {
            chartTitle += "st";
        } else if(usedWindowIndex.substr(usedWindowIndex.length-1,1) === "2" && usedWindowIndex !== "12") {
            chartTitle += "nd";
        } else if(usedWindowIndex.substr(usedWindowIndex.length-1,1) === "3") {
            chartTitle += "rd";
        } else {
            chartTitle += "th";
        }
        chartTitle += " 10-Day Tumbling";
    }
    chartTitle += " Time Window";
    return chartTitle;
}

/**
 * Loads CSV file, parses it and updates the chart.
 * @param fileName CSV file name
 */
function loadData(fileName) {
    console.log("Load " + fileName);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", fileName, false);
    rawFile.onreadystatechange = function ()
    {
        console.log("Time for loading file: " + (performance.now()-timeMeasurementHelper) + "ms");
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0) {
                timeMeasurementHelper = performance.now();
                parseCSV(rawFile.responseText);
                console.log("Time parsing file: " + (performance.now()-timeMeasurementHelper) + "ms");
                if(chart === undefined) {
                    initHighchart();
                } else {
                    chart.series[0].setData(data, false);
                    var chartTitle = generateChartTitle();
                    chart.series[0].setName(chartTitle, false);
                    chart.setTitle({text: chartTitle});
                    chart.colorAxis[0].update({
                        min: min,
                        max: max
                    }, false);
                    chart.redraw();
                }
            }
        }
    };
    timeMeasurementHelper = performance.now();
    rawFile.send(null);
}

/**
 * Parses the CSV file, calculates min and max and fill the data array.
 * @param allLines All lines of the CSV file.
 */
function parseCSV(allLines) {
    // line = country,religionPrefix,actorNumber,count,avgGoldstein,avgAvgTone,quadClass1Percentage,quadClass2Percentage,quadClass3Percentage,quadClass4Percentage,windowIndex,windowStart
    data = [];
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
}

/**
 * Initializes chart.
 */
function initHighchart() {
    var chartTitle = generateChartTitle();
    chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world',
            margin: 40
        },

        title: {
            text: chartTitle
        },

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
            name: chartTitle,
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
