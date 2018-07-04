# Project "Ring Parable"

**Warning: The visualization only works on Firefox because Chrome does not allow direct access to the filesystem.**

This repository contains the visualization code of the "Ring Parable" project by Silvan Heller, Ashery Mbilinyi and Lukas Probst.

The results visualized by this UI are generated by the stream processing component which you can find on [Github](https://github.com/silvanheller/hackathon-scads).

## Representative Screenshot
![Web UI](screenshot.png?raw=true "Web UI")

## Using the UI
You can simply open the `index.html` file with Firefox. 
We provide aggregate data already in the form of `.csv`-files in the `storage/` folder. Therefore, the visualization works out-of-the-box if you clone this repo.

## Combining Stream Proccessing and Visualization
To keep our architecture as simple as possible, we are using files to store the aggregations generated by our stream processing solution.
You can simply copy the output of the stream processing repository (in the `storage/` folder) to the `storage/` folder of this repository. 

Note that in theory, it would be possible to use a message queue (such as Kafka) instead in order to consume the aggregates in real-time.

## Used Libraries and References
Some libraries and code snippets which were used during coding are referenced in the `sources.txt` file.