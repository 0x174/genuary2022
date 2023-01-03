/*
Genuary 2023 Day 3
Author: W.R. Jackson
Prompt: Glitch Art
Ideas:
Read in a copy of the Mona Lisa.

Over the face of the Mona Lisa distort and pixelate the face with a moving patch of glitch-y pixels.

On occasion invert the colors of the image, offset in dimension.

I think it would be kind of punk rock to put a hacker-esque italian phrase on it
"Ai Mali Estremi, Estremi Rimedi", Desperate Times call for Desperate Measures

*/
let t = 0
// We need to keep track of our squares.
// As each one is randomly going through each of our key-frames, it might be useful to
// make an enum.
const KeyFrame = {
    // Draw current Color with Alpha
    Zero: 0,
    // Change active opacity of rectangle
    One: 1,
    Two: 2,
    Three: 3,
};

const COLOR_ARRAY = [
    // [241, 111, 111], // Pinkish Red
    // [75, 246, 217], // Cyan
    // [251, 169, 44], //Labyrinth Orange
    [20, 20, 20], // Labyrinth Gray
    [235, 235, 235], // Light Gray, Inverted LG
]
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1100;


const NUM_SQUARES = 100
const CENTER_FACE_X = 600
const CENTER_FACE_Y = 500
const GLITCH_SQUARE_SIZE = 50
const SPATIAL_DEVIATION_X = 100
const SPATIAL_DEVIATION_Y = 150
const SIZE_DEVIATION = 2
const BASELINE_TINT = 60
function getRndInteger(min, max) {
    return Math.floor(random(min, max)) + min;
}

class GlitchSquare {
    constructor(x_pos, y_pos, size_px) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.size_px = size_px;
        // Maybe add a unique shape in here?
        this.keyframe = KeyFrame.Zero
        this.last_update = 0;
        this.internal_color = [255, 255, 255]
        this.alpha = 1;
    }

    swap_color() {
        this.internal_color = random(COLOR_ARRAY)
    }

    degrade_alpha() {
        this.alpha = this.alpha - random(1)
        if (this.alpha < 0) {
            this.alpha = 1
        }
    }

    get_rgba_string() {
        let ret = `rgba(${this.internal_color[0]}, ${this.internal_color[1]}, ${this.internal_color[2]}, ${this.alpha})`
        // console.log(ret)
        return ret
    }

    update_keyframe() {
        this.keyframe = getRndInteger(0, 3)
    }

    perturbate_space() {
        this.x_pos = CENTER_FACE_X + random(-SPATIAL_DEVIATION_X, SPATIAL_DEVIATION_X)
        this.y_pos = CENTER_FACE_Y + random(-SPATIAL_DEVIATION_Y, SPATIAL_DEVIATION_Y)
    }
}

let squareArray = []
let img;
let inconsolata;
function preload() {
    img = loadImage('assets/mona_lisa.jpg');
    inconsolata = loadFont('assets/inconsolata.ttf');
    textSize(200);
    textAlign("center", "center");
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    image(img, 0, 0);
    textFont(inconsolata);
    for (let i = 0; i < NUM_SQUARES; i++) {
        let x_pos = CENTER_FACE_X + random(-SPATIAL_DEVIATION_X, SPATIAL_DEVIATION_X)
        let y_pos = CENTER_FACE_Y + random(-SPATIAL_DEVIATION_Y, SPATIAL_DEVIATION_Y)
        let size_px = GLITCH_SQUARE_SIZE * random(-SIZE_DEVIATION, SIZE_DEVIATION)
        squareArray.push(new GlitchSquare(x_pos, y_pos, size_px))
    }
}


// Centerpoint of Face: Approx - 525px, 400px
function draw() {
    if (t % 3 === 0) {
        let tintOffset = random(-3, 3)
        tint(
            BASELINE_TINT + tintOffset,
            BASELINE_TINT + tintOffset,
            BASELINE_TINT + tintOffset,
            )
        image(img, 0, 0);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                        let index = (x + y * width)
                        img.pixels[index] = img.pixels[index] - 100
            }
        }
        for (let square in squareArray) {
            // A big switch statement based on the keyframe that effects the final drawing goes here.
            let currentSquare = squareArray[square]
            let color = currentSquare.get_rgba_string()
            fill(color)
            stroke(color)
            switch (currentSquare.keyframe) {
                case KeyFrame.Zero:
                    // Draw current Color with Alpha
                    currentSquare.degrade_alpha()
                    let color = currentSquare.get_rgba_string()
                    fill(color)
                    stroke(color)
                    currentSquare.swap_color()
                    break;
                case KeyFrame.One:
                    // Move square in random direction
                    currentSquare.perturbate_space()
                    // code block
                    break;
                case KeyFrame.Two:
                    // code block
                    break;
                default:
                // code block
            }
            currentSquare.update_keyframe()
            rect(currentSquare.x_pos, currentSquare.y_pos, currentSquare.size_px)
        }
        let text_offset = getRndInteger(-1, 1)
        let coloration_offset = getRndInteger(-20, 20)
        textSize(64 + text_offset);
        stroke(251 + coloration_offset, 169 + coloration_offset, 44 + coloration_offset)
        fill(251 + coloration_offset, 169 + coloration_offset, 44 + coloration_offset)
        rotate(radians(random(-.01, .01)))
        text('Mali Estremi, Estremi Rimedi', 200, 1000);
    }
    t = t + 1; // update time
}