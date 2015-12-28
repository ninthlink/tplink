/**
 * app.js
 *
 * TP-LINK 11ad Comparison "tpApp"
 * Designed and Developed by Ninthlink, Inc. http://www.ninthlink.com
 *
 * Defines general tplinkController to populate & power the GUI
 *
 * https://github.com/ninthlink/tplink
 *
 * v0.1 2015-12-28
 */

// attach our new controller to our app, referenced in <body ng-controller="...
angular.module('tpApp')
  .controller( 'tplinkController', tplinkController );

// inject controller dependencies
tplinkController.$inject = [ '$scope', '$filter', 'tputFactory', '$timeout' ];

// actual tplinkController function starts here
function tplinkController( $scope, $filter, tputFactory, $timeout ) {
  
  // __ seconds countdown til video auto plays
  $scope.video_src = TPLINK_CONFIG.video;
  if ( $scope.video_src ) {
    // in case it was set to false, just skip all video parts. but otherwise..
    $scope.video_every = TPLINK_CONFIG.video_countdown_seconds;
    $scope.video_autocountdown = TPLINK_CONFIG.video_countdown_auto;
  }
  
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
  } else {
    //console.log('NOT live mode : sim 11ad every '+ $scope.sample_rate );
    $scope.ad_range = TPLINK_CONFIG.mbps_max_demo_range;
    $scope.reloadTputNow = function() {
      var thespread = Math.floor( Math.random() * $scope.ad_range );
      $scope.mbps.ad = $scope.mbps_max_scale - $scope.ad_range + thespread;
      // and again later
      $scope.reloadTput();
    };
  }
  // and in either case..
  $scope.reloadTput = function() {
    // use $timeout to reload our 11ac MU/SU data every interval
    $timeout.cancel( $scope.tputTimer );
    $scope.tputTimer = $timeout( function() {
      $scope.reloadTputNow();
    }, $scope.sample_rate );
  };
  $scope.reloadTputNow();
  
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
  
  if ( $scope.video_src ) {
  
    $scope.showvideo = false;
    $scope.vtimer;
    
    $scope.playVideo = function() {
      $scope.showvideo = true;
      $timeout ( function() {
        var tpvid = document.getElementById('tpv');
        // play it now
        tpvid.play();
        // and vanilla js attach to "ended" to fire when html5 video ends
        tpvid.addEventListener('ended',$scope.vidend,false);
      }, 100 );
    };
    
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
          $scope.playVideo();
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
    $scope.maybeStartTicking = function() {
      if ( $scope.video_autocountdown ) {
        // initial start the countdown
        $scope.toggleTicking();
      }
    };
    // set up timing for video auto play
    $scope.resetVideo = function( delay ) {
      $scope.video_timeuntil = -1;
      $scope.video_ticking = false;
      $scope.showvideomenu = false;
      if ( delay ) {
        // in this case, video has finished playing, but give it a sec first
        $timeout( function() {
          $scope.showvideo = false;
          $scope.maybeStartTicking();
        }, 2000 );
      } else {
        $scope.showvideo = false;
        $scope.maybeStartTicking();
      }
    };
    $scope.resetVideo();
    
    // different button click handlers
    $scope.btnclick = function ( btn ) {
      switch ( btn ) {
        case 'play':
          if ( $scope.video_autocountdown ) {
            if ( $scope.showvideomenu ) {
              // immediate play
              $scope.playVideo();
            } else {
              $scope.toggleTicking();
              $scope.showvideomenu = true;
            }
          } else {
            // we arent doing auto countdown at all, so just play..
            $scope.playVideo();
          }
          break;
        case 'x':
          $scope.showvideomenu = false;
          if ( $scope.video_autocountdown ) {
            $scope.toggleTicking();
          }
          break;
        case 'pause':
          $scope.showvideomenu = !$scope.showvideomenu;
          break;
      }
    };
    
    // handler to trigger when the html5 video has played all the way through
    $scope.vidend = function(e) {
      $scope.resetVideo( true );
    };
  }
  // set $on( $destroy ) to be nice and wipe any $timeout(s)
  $scope.$on( '$destroy', function( event ) {
    $timeout.cancel( $scope.tputTimer );
    $timeout.cancel( $scope.vtimer );
  });
}
// end of tplinkController