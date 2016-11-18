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
    "sounds/balloons.mp3",
    "sounds/piano.mp3",
    "sounds/violin.mp3"
];

// Each entry here represents:
//  1. A color for the slider/rectangles/blips
//  2. An audio file for the slider
//  2. An anchor point, in percentage of total canvas size
//  3. A series of rectangles, where the position is a pixel offset from the anchor, and the size is in pixels
var RECTANGLES = [
    [
        PALETTE[1],
        AUDIO_FILES[0],
        new Vector(0.15, 0.15),
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
    [
        PALETTE[2],
        AUDIO_FILES[1],
        new Vector(0.5, 0.7),
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
    [
        PALETTE[3],
        AUDIO_FILES[2],
        new Vector(0.8, 0.2),
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-30, 27), new V(125, 25)),
    ]
];