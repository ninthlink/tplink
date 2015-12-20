var tpApp = angular.module('tpApp', ['angular-svg-round-progress']);

tpApp.controller('tplinkController', function ( $scope, $filter, $timeout ) {
  // __ seconds countdown til video auto plays
  $scope.video_every = 10;
  $scope.video_autocountdown = true;
  // round the time calculations to __ decimal places
  $scope.time_decimals = 2;
  // "estimated" mbps
  $scope.mbps = {
    ac: 1300,
    ad: 2800,
    eth: 1000
  };
  // array of different types of file items to compare
  $scope.files = [
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
  ];
  
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
      // and (re)init timing..
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
  $scope.resetFileTimes();
  
  $scope.calcFileTimeLoop = function() {
    // loop through for each
    angular.forEach( $scope.files, function( value, key ) {
      var thisrow = value;
      angular.forEach( $scope.mbps, function( value, key ) {
        // calcs
        thisrow.timing[key].time = thisrow.fsize / value;
      });
    });
  };
  $scope.calcFileTimeLoop();
  
  // watch for changes in the 11ad mbps
  $scope.$watch('mbps.ad', function( newvalue, oldvalue, label ) {
    if ( newvalue != oldvalue ) {
      $scope.calcFileTimeLoop();
    }
  });
  
  // format time __ seconds or __ minutes __ seconds : maybe make a directive?
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
    return oot +' seconds';
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
          // and vanilla js attach to "ended" to fire when the html5 video ends
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
});