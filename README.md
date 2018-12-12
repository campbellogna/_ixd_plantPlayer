# _ixd_plantPlayer
submission for interactive objects and environments 

plantplayer 1.0 ++

Uses p5 serial to communicate to arduino. An ultrasonic sensor passes depth data into a string via p5 JS.
The values are then transposed into music notes with the p5 Gibber library. 
The increments in the perlin noise are also based on ultrasonic sensor values.

*Note: Arduino uses Filter library to create a moving average filter, eliminating spikes or reading errors from HC SR04 sensor
