# Project "Ring Parable"

**Warning: The visualization currently only works on Firefox**

This repository contains the visualization code of the "Ring Parable" project by Silvan Heller, Ashery Mbilinyi and Lukas Probst.

## Representative Screenshot
![Web UI](screenshot.png?raw=true "Web UI")

For more information about the project, check out the [stream processing repository](https://github.com/silvanheller/hackathon-scads)

## Using the UI
You can simply open the `index.html` file with Firefox. 
We provide aggregate data already in the form of `.csv`-files in the `storage/` folder. Therefore, visualization works out-of-the-box if you clone the repo

## Combining Stream Proccessing and Visualization
Conceptually, we are using file storage as a replacement for any kind of aggregate stream storage such as Apache Kafka. 

In our case, you can simply copy the output of the stream processing repository (In the `storage/` folder there) to the `storage/` folder in this repository. 
The UI code reads from the `storage/` folder.