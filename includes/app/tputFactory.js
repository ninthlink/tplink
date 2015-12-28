/**
 * tputFactory.js
 *
 * TP-LINK 11ad Comparison "tpApp"
 * Designed and Developed by Ninthlink, Inc. http://www.ninthlink.com
 *
 * Provides methods for loading tput datas from given iperf_files(s)
 *
 * https://github.com/ninthlink/tplink
 *
 * v0.1 2015-12-28
 */
 
angular
  .module('tpApp')
  .factory('tputFactory', tputFactory);

tputFactory.$inject = [ '$http', '$q', '$timeout' ];

function tputFactory( $http, $q, $timeout ) {
  var file_count = 0, // # of files to loop, to be replaced shortly
      iperf_dir = TPLINK_CONFIG.iperf_dir, // relative path?
      iperf_files = TPLINK_CONFIG.iperf_files,
      timeout_ms = TPLINK_CONFIG.timeout_ms,
      tputs = [], // array for caching (previous) tput results,
      stored_total = 0,
      o = {}; // and finally our actual instance object that we will return
  /**
   * initial Promises for data to populate 11AD tput data
   */
  o.loadTputs = function() {
    file_count = iperf_files.length;
    
    var tputPromises = [];
    
    for ( i = 0; i < file_count; i = i + 1 ) {
      // init our tput data
      tputs[i] = 0;
      // then set up "Promises" array so we can use $q.all
      var fname = iperf_files[i];
      tputPromises[i] = o.loadTput( i, fname );
    }
    
    return $q.all( tputPromises ).then(function(results) {
      //console.log('xx returning total tputs INIT results xx');
      //console.log(results);
      // recalculate totals for the new numbers here
      stored_total = 0;
      angular.forEach( tputs, function( d ) {
        stored_total += d;
      });
      // return our conglomerated data
      return {
        number_of_files: file_count,
        tputs: tputs,
        total: stored_total
      };
    });
  };
  /**
   * obscures $http.get requests?
   */
  o.getTputData = function( n, fname, defer ) {
    //console.log( 'getTputData : mode = '+ mode +' , n = '+ n +', fname = '+ fname );
    return $http.get( iperf_dir +'/'+ fname, { timeout: defer.promise });
  };
  /**
   * gets response from getTputData and does some parsing to conglomerate feeds together?
   */
  o.loadTput = function( n, fname ) {
    var j = n;
    //console.log( 'loadTput for n ' + n + ' i '+ i + ' fname '+ fname +' : j = '+ j );
    // set up the $q.defer Promise
    var defer = $q.defer();
    // call our getTputData & process result after it returns
    o.getTputData( n, fname, defer ).then(function(result) {
      //console.log( 'throughput #'+ n +' loaded for mode '+ i +' from '+ fname +' : j = '+ j + ' : ' );
      //console.log( result.data );
      // extract number from data like 'eth0: 123 0'
      var newtput = o.parseTputData( result.data );
      if ( newtput > 0 ) {
        tputs[j] = newtput;
      }
      //}
      // pass the data back upstream
      //console.log('returning tput '+ j);
      //console.log(tputs[j]);
      defer.resolve( tputs[j] );
    },
    function(err) {
      //defer.reject(err);
      tputs[j] = 0;
      // instead of rejecting, send anyways
      defer.resolve( tputs[j] );
    });
    
    $timeout( function() {
      defer.resolve( tputs[j] );
    }, timeout_ms );
    
    return defer.promise;
  };
  /**
   * extracts tput # from data like "eth0: 123 0"
   */
  o.parseTputData = function( data ) {
    var tput = 0;
    // i dont know, maybe just grab the very last "... ### Mbits/sec" value?
    var lastfound = data.lastIndexOf(' Mbits/sec');
    if ( lastfound > 0 ) {
      var pchunk = data.substr(0, lastfound);
      if ( pchunk.length > 0 ) {
        var pspace = pchunk.lastIndexOf(' ') + 1;
        if ( pspace > 0 ) {
          var trythis = data.substr( pspace, lastfound - pspace );
          tput = parseInt( trythis, 10 );
        }
      }
    }
    
    return tput;
  };
  
  // and return our factory
  return o;
}
