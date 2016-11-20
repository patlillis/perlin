var PALETTES = {
    blue: [
        '#FAFAFA',
        '#C7EEFF',
        '#0077C0',
        '#1D242B'
    ],
    lemonade: [
        '#F7E74A',
        '#09C6AB',
        '#068888',
        '#02556D'
    ],
    cyborg: [
        '#3C2F3D',
        '#2EAC6D',
        '#9DDA52',
        '#F0F0F0'
    ],
    acid: [
        '#041122',
        '#259073',
        '#7FDA89',
        '#E6F99D'
    ]
};
var PALETTE = PALETTES.acid;

var AUDIO_FILES = [
    "sounds/piano.mp3",
    "sounds/violin.mp3",
    "sounds/balloons.mp3",
];

// Each entry here represents:
//  1  -  A color for the slider/rectangles/blips
//  2  -  An audio file for the slider
//  3  -  Vector corresponding to the slider's 0 position (off) in percentage of total canvas size
//  4  -  Vector corresponding to the slider's 1.0 position (on) in percentage of total canvas size
//  5  -  Number in the range [0, 1.0] representing the starting point between the 0 and 100 positions.
//  6+ -  A series of rectangles, where the position is a pixel offset from the anchor, and the size is in pixels
var RECTANGLES = [
    [
        PALETTE[1],
        AUDIO_FILES[0],
        new V(0.1, 0.3),
        new V(0.9, 0.3),
        0.75,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
    [
        PALETTE[2],
        AUDIO_FILES[1],
        new V(0.1, 0.5),
        new V(0.9, 0.5),
        0.5,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
    [
        PALETTE[3],
        AUDIO_FILES[2],
        new V(0.1, 0.7),
        new V(0.9, 0.7),
        0.25,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-30, 27), new V(125, 25)),
    ]
];