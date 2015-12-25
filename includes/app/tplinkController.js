// attach our new controller to our app, referenced in <body ng-controller="...
angular.module('tpApp')
  .controller( 'tplinkController', tplinkController );

// inject controller dependencies
tplinkController.$inject = [ '$scope', '$filter', 'tputFactory', '$timeout' ];

// actual tplinkController function starts here
function tplinkController( $scope, $filter, tputFactory, $timeout ) {
  
  // __ seconds countdown til video auto plays
  $scope.video_every = TPLINK_CONFIG.video_countdown_seconds;
  $scope.video_autocountdown = TPLINK_CONFIG.video_countdown_auto;
  
  // round the time calculations to __ decimal places
  $scope.time_decimals = TPLINK_CONFIG.time_decimals;
  
  // "estimated" mbps
  $scope.mbps = TPLINK_CONFIG.initial_mbps;
  $scope.mbps_max_scale = TPLINK_CONFIG.mbps_max_scale;
  $scope.needle_deg = {
    ac: 0,
    ad: 0,
    eth: 0
  };
  
  // how many ms (1000 x # of seconds) to read or generate #s
  $scope.sample_rate = TPLINK_CONFIG.sample_rate;
  
  // array of different types of file items to compare
  $scope.files = TPLINK_CONFIG.files_array;
  
  // whether to run in LIVE mode, reading in the file(s) below, or Simulate
  $scope.live_mode = TPLINK_CONFIG.live_mode;
  
  // iperf output directory
  $scope.iperf_dir = $scope.live_mode ?  TPLINK_CONFIG.iperf_dir : '';
  
  // iperf output file(s) to try and read, inside the above iperf_dir
  $scope.iperf_files = $scope.live_mode ?  TPLINK_CONFIG.iperf_files : [];
  
  $scope.resetFileTimes = function() {
    // loop through for each
    angular.forEach( $scope.files, function( value, key ) {
      if ( !value.hasOwnProperty('fsize') ) {
        // calculate total fsize for each "transfer"
        if ( value.qty > 1 ) {
          value.fsize = value.qty * value.mb;
        } else {
          value.fsize = value.mb;
        }
      }
      if ( !value.hasOwnProperty('mbstr') ) {
        // add a "pretty" mb / gb size
        if ( value.mb < 1000 ) {
          value.mbstr = value.mb +'MB';
        } else {
          value.mbstr = ( value.mb / 1000 ) +'GB';
        }
      }
      // (re)init "timing" forEach..
      value.timing = {
        ac: {
          dur: 0,
          time: 0
        },
        ad: {
          dur: 0,
          time: 0
        },
        eth: {
          dur: 0,
          time: 0
        }
      };
    });
  };
  // initial reset set
  $scope.resetFileTimes();
  
  // function to iterate each $scope.files & calc times forEach mbps
  $scope.calcLoop = function() {
    // loop through for each
    angular.forEach( $scope.mbps, function( value, key ) {
      var tput = value;
      var tputkey = key;
      angular.forEach( $scope.files, function( value, key ) {
        // calcs
        value.timing[tputkey].time = value.fsize / tput;
      });
      // and rotate needle
      $scope.needle_deg[tputkey] = Math.ceil( ( tput / $scope.mbps_max_scale ) * 180 );
    });
  };
  // initial calc
  $scope.calcLoop();
  
  // watch for changes in the 11ad mbps and re compute accordingly
  $scope.$watch('mbps.ad', function( newvalue, oldvalue, label ) {
    if ( newvalue != oldvalue ) {
      $scope.calcLoop();
    }
  });
  
  // determine whether we are in "live" file reading mode or demo generating
  $scope.tputTimer;
  if ( $scope.live_mode ) {
    //console.log('LIVE mode : read 11ad files every '+ $scope.sample_rate );
    // and then? load files.. 
    $scope.reloadTputNow = function() {
      //console.log('reloadTputNow');
      tputFactory.loadTputs().then( function( results ) {
        //console.log('tputFactory returned!');
        //console.log(results);
        if ( results.hasOwnProperty('total') ) {
          $scope.mbps.ad = results.total;
        }
        //$scope.reprocessResults( results );
      });
      // and no matter how long that takes, trigger this again
      $scope.reloadTput();
    };
    $scope.reloadTput = function() {
      // use $timeout to reload our 11ac MU/SU data every interval
      $timeout.cancel( $scope.tputTimer );
      $scope.tputTimer = $timeout( function() {
        $scope.reloadTputNow();
      }, $scope.sample_rate );
    };
    $scope.reloadTputNow();
  } else {
    //console.log('NOT live mode : sim 11ad every '+ $scope.sample_rate );
  }
  
  // format time __ seconds or __ minutes __ seconds : maybe make directive?
  $scope.formatTime = function ( t ) {
    var oot = $filter('number')(t, 2);
    if ( oot > 60 ) {
      var m = Math.floor( oot / 60 );
      var s = oot % 60;
      oot = m +' minute'+ ( m > 1 ? 's' : '' ) +' '+ s;
    }
    if ( oot == 0 ) {
      return '...';
    }
    //return oot +' seconds';
    return oot;
  };
  
  $scope.showvideo = false;
  // set up timing for video auto play
  $scope.resetVideo = function() {
    $scope.video_timeuntil = -1;
    $scope.video_ticking = false;
    $scope.showvideo = false;
  };
  $scope.resetVideo();
  
  $scope.vtimer;
  
  $scope.vidTimerTick = function() {
    $scope.video_ticking = true;
    $timeout.cancel( $scope.vtimer );
    // tick every second
    $scope.vtimer = $timeout( function() {
      $scope.video_timeuntil++;
      if ( $scope.video_timeuntil <= $scope.video_every ) {
        $scope.vidTimerTick();
      } else {
        //console.log($scope.video_every +' SECONDS : PLAY VIDEO!');
        $scope.showvideo = true;
        $timeout ( function() {
          var tpvid = document.getElementById('tpv');
          // play it now
          tpvid.play();
          // and vanilla js attach to "ended" to fire when html5 video ends
          tpvid.addEventListener('ended',$scope.vidend,false);
        }, 100 );
      }
    }, 1000 );
  };
  
  $scope.toggleTicking = function() {
    $timeout.cancel( $scope.vtimer );
    if ( $scope.video_ticking ) {
      // then turn off
      $scope.video_ticking = false;
    } else {
      $scope.vidTimerTick();
    }
  };
  if ( $scope.video_autocountdown ) {
    // initial start the countdown
    $scope.toggleTicking();
  }
  
  // handler to trigger when the html5 video has played all the way through
  $scope.vidend = function(e) {
    $scope.resetVideo();
    
    if ( $scope.video_autocountdown ) {
      // initial start the countdown
      $scope.toggleTicking();
    }
  };
  
  // set $on( $destroy ) to be nice and wipe any $timeout(s)
  $scope.$on( '$destroy', function( event ) {
    $timeout.cancel( $scope.tputTimer );
    $timeout.cancel( $scope.vtimer );
  });
}
// end of tplinkController