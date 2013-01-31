ANGUMATE v0.1
========

simple animations for angular.js

[maxhoffmann.github.com/angumate](http://maxhoffmann.github.com/angumate)

##Why should I use it?
- Use animations now
- Easy to setup
- Hardware accelerated
- No animations as fallback
- Small footprint

## Quick Setup
- Download version 0.1 here
- include angumate in your html
- inject angumate in your routing module
- add angumate as promise to your routes
- add directives to your elements

##How does it work?
- Angumate listens for route changes
- styles are applied to directives
- if another route event is fired:
- one deferred is created for all animations
- which is resolved after animations have finished