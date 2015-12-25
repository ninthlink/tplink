// variables and values for the TPLINK tpApp app.js to use
var TPLINK_CONFIG = {
  // __ seconds countdown until video auto plays
  video_countdown_seconds: 60,
  
  // whether video should auto countdown or not
  video_countdown_auto: true,

  // round the time calculations to __ decimal places
  time_decimals: 2,

  // initial tput mbps estimated numbers
  initial_mbps: {
    ac: 1300,
    ad: 2800,
    eth: 1000
  },

  // arbitrary "max" MBPS to calculate the scaling of progress bars & needles
  mbps_max_scale: 2800,

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
  
  // sampling rate of how many ms (1000 x # of seconds) to read or generate #s
  sample_rate: 5000,
  
  // whether to run in LIVE mode, reading in the file(s) below, or Simulate
  live_mode: true,
  
  // iperf output directory
  iperf_dir: '/iperf',
  
  // iperf output file(s) to try and read, inside the above iperf_dir
  iperf_files: [
    'iperf1.txt',
    'iperf2.txt'
  ]
};