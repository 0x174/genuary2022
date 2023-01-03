
let t = 0; // time variable
const WIDTH = 800;
const HEIGHT = 800;
const STARTING_AGE = 255;

// Inverted Percentile.
const CHANCE_OF_DECAY = 70;
const DECAY_RATE = 1;
const AGE_THRESHOLD = 5;

let POINT_ARRAY = []

class OrangePoint {
    constructor(height, width) {
        this.y_pos = height;
        this.x_pos = width;
        // Maybe add a unique shape in here?
        this.age = STARTING_AGE
    }
}

function calcAngle(x, y) {
    const xAngle = map(0, 0, random(0, WIDTH), 4 * PI, PI, true);
    const yAngle = map(0, 0, random(0, HEIGHT), PI, 4 * PI, true);
    // and also varies based on the particle's location
    const angle = xAngle * (x / width) + yAngle * (y / height);

    // each particle moves in a circle
    const myX = x + 20 * sin(8 * PI * t + angle);
    const myY = y + 20 * cos(2 * PI * t + angle);
    return [myX, myY]
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    // Generate an array of points
    // As each point 'ages', it decays until it eventually it is dropped off of the screen.
    // At that point, a new point is generated.
    // While doing so, we flash cyber-punk-esque text across the screen.
    for (let x = 0; x <= WIDTH; x = x + 35) {
        for (let y = 0; y <= HEIGHT; y = y + 30) {
            let pos = calcAngle(x, y)
            POINT_ARRAY.push(new OrangePoint(pos[0], pos[1]))
        }
    }
}

function draw() {
    background('#141414'); // translucent background (creates trails)
    stroke('#FBA92C')
    // make a x and y grid of ellipses
    for (let i in POINT_ARRAY) {
        let current_point = POINT_ARRAY[i]
        fill(current_point.age)
        ellipse(current_point.x_pos, current_point.y_pos, 4)
        let die_roll = random(100)
        if (die_roll > CHANCE_OF_DECAY) {
            current_point.age = current_point.age - (DECAY_RATE + random(1, 5))
        }
    }
    for (let i in POINT_ARRAY) {
        let active_point = POINT_ARRAY[i]
        if (active_point.age < AGE_THRESHOLD) {
            active_point.x_pos = active_point.x_pos + random(-10, 10)
            active_point.y_pos = active_point.y_pos + random(-10, 10)
            active_point.age = STARTING_AGE
        }
    }
    // And then we want some minute chances to swing high or fail instantly.
    // for (let i in POINT_ARRAY) {
    //     let active_point = POINT_ARRAY[i]
    //     let die_roll = random(101)
    //     if (die_roll < 99) {
    //         active_point.age = STARTING_AGE
    //     }
    //     if (die_roll > 2) {
    //         active_point.age = 0
    //     }
    // }
    t = t + 0.01; // update time
}