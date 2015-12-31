/**
 * config.js
 *
 * TP-LINK 11ad Comparison "tpApp"
 * Designed and Developed by Ninthlink, Inc. http://www.ninthlink.com
 *
 * Variables & values for the TP-LINK tpApp. See the README for more details.
 *
 * https://github.com/ninthlink/tplink
 *
 * v1.0.8 2015-12-29
 */

var TPLINK_CONFIG = {
  // video name inside /video directory, or false if no video
  video: 'video/demo.mp4',
  
  // __ seconds countdown until video auto plays
  video_countdown_seconds: 60,
  
  // whether video should auto countdown or not
  video_countdown_auto: true,

  // round the time calculations to __ decimal places
  time_decimals: 2,
  
  // extra multiplier for time calculations
  time_calc_scale: 8,
  
  // sampling rate of how many ms (1000 x # of seconds) to read or generate #s
  sample_rate: 5000,
  
  // how many ms (1000 x # of seconds) to allow trying to load file before fail
  timeout_ms: 1000,
  
  // whether to run in LIVE mode, reading in the file(s) below, or Simulate
  live_mode: false,
  
  // iPerf output directory
  iperf_dir: '/tplink/iperf',
  
  // iPerf output file(s) to try and read, inside the above iperf_dir
  iperf_files: [
    'iperf1.txt'
  ],
  
  // define our modes and some colors and such here
  modes: [{
   key: 'ad',
   title: 'Wireless AD',
   label: 'AVERAGE',
   ghz: '60GHz',
   color: '#2976cb'
  },{
   key: 'ac',
   title: 'Wireless AC',
   label: 'AVERAGE',
   ghz: '5GHz',
   color: '#761e66'
  },{
   key: 'eth',
   title: 'Wireless N',
   label: 'AVERAGE',
   ghz: '2.4GHz',
   color: '#e46f00'
  }],
  
  // initial tput mbps estimated numbers. Keys should match keys of modes above
  initial_mbps: {
    ad: 1800,
    ac: 800,
    eth: 200
  },
  
  // rather than static mbps #s, can cycle through array of simulated values
  mbps_arrays: {
    ad: [],
    ac: [ 650, 648, 644, 652, 653, 649, 651, 648, 648, 652, 651, 652, 647, 649, 651 ],
    eth: [ 180, 179, 183, 178, 177, 181, 176, 179, 177, 182, 176, 178, 177, 180, 183 ]
  },

  // array of different types of file items to compare : repeat object for each
  files_array: [
    {
      type: 'pdf',
      name: 'PDF',
      qty: 1000,
      mb: 0.6
    },
    {
      type: 'ebook',
      name: 'Ebooks',
      qty: 1000,
      mb: 1
    },
    {
      type: 'photo',
      name: 'Photos',
      qty: 1000,
      mb: 1.5
    },
    {
      type: 'song',
      name: 'Songs',
      qty: 1000,
      mb: 3.5
    },
    {
      type: 'hdmovie',
      name: 'HD Movie',
      qty: 1,
      mb: 8000
    },
    {
      type: 'fourk',
      name: '4K Movie',
      qty: 1,
      mb: 100000
    }
  ],
  
  // arbitrary "max" MBPS to calculate the scaling of progress bars & needles
  mbps_max_scale: 2800,
  
  // "magic" multiplier to fix converting mpbs / mbps_max_scale to some degrees
  mbps_needle_magic_mult: 355,
  
  // arbitrary range that 11ad could vary by, if in demo mode
  mbps_max_demo_range: 200
};
