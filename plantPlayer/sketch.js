var serial;
var portName = "COM9";
var svalue = 10;
var scl = 10;
var cols, rows;
var zoff = 0;
var fr;
var particles = [];
var flowfield;
var font,
    fontsize = 40;

function preload() {
    font = loadFont('resources/rfont.otf');
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 255);
    cols = floor(width / scl);
    rows = floor(height / scl);
    fr = createP('');
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);

    flowfield = new Array(cols * rows);

    for (var i = 0; i < 300; i++) {
        particles[i] = new Particle();
    }
    background(120,80);
    fill(80,80);
    text('plantplayer1.0', width / 2, height / 2);
    serial = new p5.SerialPort();
    serial.list();
    serial.open(portName);
    serial.on('list', gotList);
    serial.on('data', gotData);

    // sound engine
    fm = FM({
        maxVoices: 16,
        attack: ms(1)
    })
    fm.fx.add(Reverb());

}

function gotList(thelist) {
    println("List of Serial Ports:");
    for (var i = 0; i < thelist.length; i++) {
        println(i + " " + thelist[i]);
    }
}

function gotData() {
    var currentString = serial.readLine(); 
    trim(currentString); // trim off trailing whitespace
    if (!currentString) return; // if the incoming string is empty, do no more
    console.log(currentString);
    if (!isNaN(currentString)) { 
        svalue = currentString; // save the currentString to use for the text position in draw()
    }
}

function draw() {
    //text("sensor value: " + value, value, 30);
    var child = fm.voiceCount,
        frequency = 440 + (svalue / this.rows) * 880 + (880 / this.rows) / (svalue + 1),
        pan = -1 + (svalue / this.cols) * 2
    fm.note(frequency)
    fm.children[child].pan = pan

    //perlin noise based off Coding Challenge 048 by Daniel Schiffman
    var inc = svalue * 0.1;
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;
            var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            var v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowfield[index] = v;
            xoff += inc;
            stroke(0, 100);
            strokeWeight(4);
            // push();
            // translate(x * scl, y * scl);
            // rotate(v.heading());
            // strokeWeight(1);
            // line(0, 0, scl, 0);
            // pop();
        }
        yoff += inc;
        zoff += 0.0003;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }
    frameRate(8);
}
