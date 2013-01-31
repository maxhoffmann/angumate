/**
 * Angumate - Animations for Angular.js
 *
 * @author Maximilian Hoffmann http://maximilianhoffmann.com
 */

var angumate = angular.module('Angumate',[]);

// Elements
angumate.factory('elements', function() {
  var elements = [];

  return {
    add: function( el ) {
      elements.push(el);
    },
    get: function() {
      return elements;
    },
    clear: function() {
      elements = [];
    }
  };
});

// Promises
angumate.factory('angumate', ['$q', function($q) {

  "use strict";

  var deferred;

  return {

    wait: function() {
      deferred = $q.defer();
    },

    promise: function() {
      if ( deferred === undefined ) { return true; }
      return deferred.promise;
    },

    resolve: function() {
      deferred.resolve();
    },

    support: (function() {

      function testCssProperty(p, rp) {
        var b = document.body || document.documentElement,
        s = b.style;

        // No css support detected
        if(typeof s === 'undefined') { return false; }

        // Tests for standard prop
        if(typeof s[p] === 'string') { return rp ? [p, p] : true; }

        // Tests for vendor specific prop
        var v = ['moz', 'Webkit', 'Khtml', 'O', 'ms', 'Icab'];
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for(var i=0; i<v.length; i++) {
          if(typeof s[v[i] + p] === 'string') { return rp ? [ ( v[i]+p ), ('-'+v[i].toLowerCase()+'-'+p.toLowerCase()) ] : true; }
        }
      }

      if ( testCssProperty('transition') && testCssProperty('transform') ) {
        return {
          transition: testCssProperty('transition', true),
          transitionDuration: testCssProperty('transitionDuration', true),
          transitionDelay: testCssProperty('transitionDelay', true),
          transform: testCssProperty('transform', true)
        };
      }

      return false;

    })()

  };

}]);

// Animations Support
angumate.service('animations', function() {

  function testCssProperty(p, rp) {
    var b = document.body || document.documentElement,
    s = b.style;

    // No css support detected
    if(typeof s === 'undefined') { return false; }

    // Tests for standard prop
    if(typeof s[p] === 'string') { return rp ? [p, p] : true; }

    // Tests for vendor specific prop
    var v = ['moz', 'Webkit', 'Khtml', 'O', 'ms', 'Icab'];
    p = p.charAt(0).toUpperCase() + p.substr(1);
    for(var i=0; i<v.length; i++) {
      if(typeof s[v[i] + p] === 'string') { return rp ? [ ( v[i]+p ), ('-'+v[i].toLowerCase()+'-'+p.toLowerCase()) ] : true; }
    }
  }

  this.supported = false;

  if ( testCssProperty('transition') && testCssProperty('transform') ) {
    this.transition         = testCssProperty('transition', true);
    this.transitionDuration = testCssProperty('transitionDuration', true);
    this.transitionDelay    = testCssProperty('transitionDelay', true);
    this.transform          = testCssProperty('transform', true);
    this.supported          = true;
  }

});

// Initialization
angumate.run(['$rootScope', '$timeout', 'angumate', 'elements', function($rootScope, $timeout, angumate, elements) {

  $rootScope.$on('$routeChangeStart', function(e, current, previous) {
    console.log('start');
    angumate.wait();

    var transitionEndDuration = 300,
        transitionEndDelay = 0;

    angular.forEach(elements.get(), function(el) {

      el.css(angumate.support.transitionDuration[0], transitionEndDuration+'ms')
        .css(angumate.support.transitionDelay[0], el.delay+'ms')
        .css(el.animation);

      if ( el.delay > transitionEndDelay ) {
        transitionEndDelay = el.delay;
      }

    });

    $timeout(function() {
      angumate.resolve();
    }, transitionEndDuration+transitionEndDelay);

  });

  $rootScope.$on('$routeChangeSuccess', function(e, current, previous) {
    console.log('success');
    elements.clear();
  });

}]);

// am-clip Directive
angumate.directive('amClip', ['$timeout', 'animations', 'elements', function($timeout, animations, elements) {

  "use strict";

  if ( !animations.supported ) {
    return false;
  }

  var directions = {
    up: 'translateY(100%)',
    down: 'translateY(-100%)',
    left: 'translateX(-100%)',
    right: 'translateX(100%)'
  };

  return {

    compile: function(tElement, tAttrs, transclude) {

      var el;

      if (!tElement.children().length) {
        tElement.html('<span style="visibility: hidden">'+tElement.html()+'</span>');
      }
      tElement.css('overflow','hidden');
      el = tElement.children();

      // init animation
      el.css('display', 'inline-block')
        .css(animations.transition[0], animations.transform[1]+' .8s ease '+(+tAttrs.amDelay||0)+'ms')
        .css(animations.transform[0], directions[tAttrs.amClip||'up']);

      // disappearance animation
      el.animation = {};
      el.animation[animations.transform[0]] = directions[tAttrs.amClip||'up'];

      // half delay for disappearance
      el.delay = (+tAttrs.amDelay/2)||0;

      elements.add(el);

      $timeout(function() {

        // appearance animation
        el.css('visibility', null)
          .css(animations.transform[1], null);

      }, 0);
    }

  };

}]);

// am-fade Directive
angumate.directive('amFade', ['$timeout', 'animations', 'elements', function($timeout, animations, elements) {

  "use strict";

  if ( !animations.supported ) {
    return false;
  }

  return {

    compile: function(tElement, tAttrs, transclude) {

      var el = tElement;

      // init animation
      el.css('opacity', 0);

      // disappearance animation
      el.animation = {
        'opacity': 0
      };

      // half delay for disappearance
      el.delay = (+tAttrs.amDelay/2)||0;

      elements.add(el);

      $timeout(function() {

        // appearance animation
        el.css(animations.transition[0], 'opacity .8s ease '+(+tAttrs.amDelay||0)+'ms');
        el.css('opacity', null);

      }, 0);

    }

  };

}]);