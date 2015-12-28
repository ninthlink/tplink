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
 * v0.1 2015-12-28
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
  
  // sampling rate of how many ms (1000 x # of seconds) to read or generate #s
  sample_rate: 5000,
  
  // how many ms (1000 x # of seconds) to allow trying to load file before fail
  timeout_ms: 1000,
  
  // whether to run in LIVE mode, reading in the file(s) below, or Simulate
  live_mode: false,
  
  // iperf output directory
  iperf_dir: '/tplink/iperf',
  
  // iperf output file(s) to try and read, inside the above iperf_dir
  iperf_files: [
    'iperf1.txt',
    'iperf2.txt',
    'iperf3.txt'
  ],
  
  // define our modes and some colors and such here
  modes: [{
   key: 'ad',
   title: 'Wireless AD',
   ghz: '60GHZ',
   color: '#2976cb',
  },{
   key: 'ac',
   title: 'Wireless AC',
   ghz: '5GHZ',
   color: '#761e66',
  },{
   key: 'eth',
   title: 'Wireless N',
   ghz: '2.4GHZ',
   color: '#e46f00',
  }],
  
  // initial tput mbps estimated numbers. Keys should match keys of modes above
  initial_mbps: {
    ad: 2800,
    ac: 1300,
    eth: 1000
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
  
  // arbitrary range that 11ad could vary by, if in demo mode
  mbps_max_demo_range: 800
};