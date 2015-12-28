# TP-LINK 11ad Comparison
Angular app GUI to simulate or load real iPerf data comparing 11ad, 11ac & more.

See below for [installation instructions](#installation) and [configurations](#configuration).

![TPLink GUI](https://raw.github.com/ninthlink/tplink/master/includes/images/screenshot.jpg)

## installation

1. This Angular app has been designed and developed and tested and optimized for running on a Windows PC in [Google Chrome](http://www.google.com/chrome/).
2. To ensure that Permissions and everything else are configured correctly, we recommend running from an install of [XAMPP](https://www.apachefriends.org/download.html)
3. Once XAMPP is installed on your Windows PC, download the [latest release](https://github.com/ninthlink/tplink/releases) and rename the directory to something like "tplink", and place it inside your htdocs folder.
4. Copy the config-default.js and rename it config.js
5. Follow the [configuration instructions](#configuration) below for more customization and setup as desired.
6. Launch a Google Chrome browser window and navigate to http://localhost/tplink/ (or wherever you downloaded the files to)
 
## configuration

Note again that you need to copy the config-default.js and rename it to config.js in order to run the app. Once you have done so, the following items can be modified inside the [config.js](config-default.js} file :

| Key   | Description   | Default   | Possible values   |
| ---   | ---           | ---       | ---               |
| `video` | either `false` or a string of directory and file name of an H.264 MP4 file for displaying through the GUI. Note that anything in the /video subdirectory is ignored from GIT. You will have to provide your own MP4 file.   | `false` | `false`, `'video/demo.mp4'` | 
| `video_countdown_seconds` | Number of seconds countdown until video auto plays, if `video` above is not `false` | 60 | Positive number |
| `video_countdown_auto` | Whether video should auto countdown or not. `true` to auto countdown, `false` to ignore any `video_countdown_seconds` above and include just a Play button to Play whatever `video` above | `true` | `true` or `false`  |
| `time_decimals` | Round the time calculations to __ decimal places | 2 | Non-negative integer |
| `sample_rate` | Sampling rate of how many ms (1000 x # of seconds) to read or generate #s | 5000 | Positive integer |
| `timeout_ms` | How many ms (1000 x # of seconds) to allow trying to load file before fail | 1000 | Non-negative integer |
| `live_mode` | `false` will cause the system to auto generate simulated values for the "11ad" MBPS Throughput. `true` will read the `iperf_files` below and attempt to parse throughput value(s) from there. | `false` | `true` or `false` |
| `iperf_dir` | iPerf output directory to load the `iperf_files` from, if `live_mode` above is set to `true`. Note : must be an absolute link, so if your setup is running at http://localhost/tplink/ , the `iperf_dir` = `'/tplink/iperf'` or something like that. Without trailing slash at the end. | `'/tplink/iperf'` | string for absolute url of subdirectory |
| `iperf_files` | Array of output file(s) from an iPerf setup to try and read if above `live_mode` = `true`, located inside the above `iperf_dir` | `[ 'iperf1.txt', 'iperf2.txt' ]` | array of string(s) |
| `modes` | Array of objects with information about the 3 Modes we are comparing | `[{ key: 'ad', title: 'Wireless AD', ghz: '60GHZ', color: '#2976cb' },...]` | see default value |
| `initial_mbps` | Object with initial throughput MBPS estimated numbers. Keys should match keys of modes above | `{ ad: 2800, ac: 1300, eth: 1000 }` | see default value |
| `files_array` | Array of different types of file items to compare : repeat object for each. | `[{ type: 'pdf', name: 'PDF', qty: 1000, mb: 0.6 },...]` | see default value |
| `mbps_max_scale` | Semi-arbitrary "max" MBPS to calculate the scaling of progress bars & needles | 2800 | Positive integer |
| `mbps_max_demo_range` | Semi-arbitrary range that 11ad could vary by, if in demo mode ( `live_mode` = `false` | 800 | Positive integer |
