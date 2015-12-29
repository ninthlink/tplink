# TP-LINK 11ad Comparison
Angular app GUI to simulate or load real iPerf data comparing 11ad, 11ac & more.

See below for [installation instructions](#installation) and [configurations](#configuration).

![TPLink GUI](https://raw.github.com/ninthlink/tplink/master/includes/images/screenshot.jpg)

## installation

1. This Angular app has been designed and developed and tested and optimized for running on a Windows PC in [Google Chrome](http://www.google.com/chrome/).
2. To ensure that Permissions and everything else are configured correctly, we recommend running from an install of [XAMPP](https://www.apachefriends.org/download.html)
3. Once XAMPP is installed on your Windows PC, download the [latest release](https://github.com/ninthlink/tplink/releases) and rename the directory to something like "tplink", and place it inside your htdocs folder.
4. Copy the config-default.js and rename it config.js
5. Follow the [configuration instructions](#configuration) below for more customization and setup as desired. See additional notes below on Demo Mode / Live Mode / Video setup.
6. Launch a Google Chrome browser window and navigate to http://localhost/tplink/ or wherever the files were downloaded

### Demo Mode

By default, the config-default.js is set with `live_mode` = `false` which means that the system will auto generate throughput numbers to simulate for comparison between whatever `modes` 11ad / 11ac / gigabit ethernet. In this case, you might not even need XAMPP in order to run the demo.

### Live Mode

`live_mode` = `true` was designed to parse a series of given output txt files from iPerf, parse the last found "Mbits/sec" number, and sum up whatever number from each of the `iper_files` provided in order to generate the Throughput number for 11ad and comparison calculations. iPerf should be configured to output the files to a subdirectory inside where these files are setup, so if you have set these up in your C:\xampp\htdocs\tplink , then iPerf should output to C:\xampp\htdocs\tplink\iperf , and the `iperf_dir` in the [config.js](#configuration) should be set to `'/tplink/iperf'`

### Video playback

While the GIT repo does not include any video file in it, if you save a video mp4 like a "demo.mp4" to a "video" subdirectory (/video/demo.mp4) and then set the `video` [configuration](#configuration) variable appropriately, the system will display a Play button that can be clicked to play the video full screen on top of the GUI. If the other variables of `video_countdown_seconds` and `video_countdown_auto` are also set, the GUI will automatically start a timer that will play the video after the X number of seconds, and the Play button can be clicked to Pause the timer countdown and/or automatically play the video at any time.

## configuration

Note again that you need to copy the config-default.js and rename it to config.js in order to run the app. Once you have done so, the following items can be modified inside the [config.js](config-default.js} file :

| Key   | Description   | Default   | Possible values   |
| ---   | ---           | ---       | ---               |
| `video` | either `false` or a string of directory and file name of an H.264 MP4 file for displaying through the GUI. Note that anything in the /video subdirectory is ignored from GIT. You will have to provide your own MP4 file.   | `false` | `false`, `'video/demo.mp4'` | 
| `video_countdown_seconds` | Number of seconds countdown until video auto plays, if `video` above is not `false` | 60 | Positive number |
| `video_countdown_auto` | Whether video should auto countdown or not. `true` to auto countdown, `false` to ignore any `video_countdown_seconds` above and include just a Play button to Play whatever `video` above | `true` | `true` or `false`  |
| `time_decimals` | Round the time calculations to __ decimal places | 2 | Non-negative integer |
| `time_calc_scale` | Extra multiplier for time calculations | 8 | Positive integer |
| `sample_rate` | Sampling rate of how many ms (1000 x # of seconds) to read or generate #s | 5000 | Positive integer |
| `timeout_ms` | How many ms (1000 x # of seconds) to allow trying to load file before fail | 1000 | Non-negative integer |
| `live_mode` | `false` will cause the system to auto generate simulated values for the "11ad" MBPS Throughput. `true` will read the `iperf_files` below and attempt to parse throughput value(s) from there. | `false` | `true` or `false` |
| `iperf_dir` | iPerf output directory to load the `iperf_files` from, if `live_mode` above is set to `true`. Note : must be an absolute link, so if your setup is running at http://localhost/tplink/ , the `iperf_dir` = `'/tplink/iperf'` or something like that. Without trailing slash at the end. | `'/tplink/iperf'` | string for absolute url of subdirectory |
| `iperf_files` | Array of output file(s) from an iPerf setup to try and read if above `live_mode` = `true`, located inside the above `iperf_dir` | `[ 'iperf1.txt', 'iperf2.txt' ]` | array of string(s) |
| `modes` | Array of objects with information about the 3 Modes we are comparing | `[{ key: 'ad', title: 'Wireless AD', label: 'AVERAGE', ghz: '60GHz', color: '#2976cb' },...]` | see default value |
| `initial_mbps` | Object with initial throughput MBPS estimated numbers. Keys should match keys of modes above | `{ ad: 2800, ac: 1300, eth: 1000 }` | see default value |
| `mbps_arrays` | Object with three arrays for mbps cycling through static values, or empty array to not or to indicate loading dynamically. Keys should match keys of modes above | `{ ad: [], ac: [ 650, 648, 644, 652, 653, 649, 651, 648, 648, 652, 651, 652, 647, 649, 651 ], eth: [ 180, 179, 183, 178, 177, 181, 176, 179, 177, 182, 176, 178, 177, 180, 183 ] }` | see default value |
| `files_array` | Array of different types of file items to compare : repeat object for each. | `[{ type: 'pdf', name: 'PDF', qty: 1000, mb: 0.6 },...]` | see default value |
| `mbps_max_scale` | Semi-arbitrary "max" MBPS to calculate the scaling of progress bars & needles | 2800 | Positive integer |
| `mbps_max_demo_range` | Semi-arbitrary range that 11ad could vary by, if in demo mode ( `live_mode` = `false` | 800 | Positive integer |

## changelog

### v1.0.5

+ Fixed issue where if a calculated time was more than 999 seconds, it wasn't formatting to minutes & seconds
+ Fixed a bug where the colors of the two text columns for 11ac and 11ad were switched
+ Different icons for the left column items to match other TP-LINK branding initiatives

### v1.0.4

+ Added functionality to cycle the 5GHz and 2.4GHz values through an array of Mbps values rather than just staying static.

### v1.0.3

+ Per further feedback, allow setting / overriding the "AVERAGE" label above the individual Throughput Mbps totals via config.js
+ Add `time_calc_scale` config setting extra multiplier for time calculations

### v1.0.2

+ Fixed a bug where if the time for a calculated transfer was > 60 seconds, sometimes it might show more than the `time_decimals` number of decimals rounding. Actually in this case, just round number of minute(s) and seconds to integers.
+ Fixed display bug to add another 10px spacing between Pause / X / Play video buttons
+ Instead of loading font from fonts.googleapis.com, just load local version
+ Fix spacing on the 11ad Mbps number
+ Cleaned up version numbers in js & css files to match

### v1.0.1

+ Changed default Mbps values for 5GHz & 2.4GHz throughputs
+ Changed labels to not all uppercase "5GHz" and "Mbps"

### v1.0

+ Initial Release

