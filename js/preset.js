var PALETTES = {
    BLUE: [
        '#FAFAFA',
        '#C7EEFF',
        '#0077C0',
        '#1D242B'
    ],
    LEMONADE: [
        '#F7E74A',
        '#09C6AB',
        '#068888',
        '#02556D'
    ],
    CYBORG: [
        '#3C2F3D',
        '#2EAC6D',
        '#9DDA52',
        '#F0F0F0'
    ],
    ACID: [
        '#041122',
        '#259073',
        '#7FDA89',
        '#E6F99D',
        '#512187'
    ]
};
var PALETTE = PALETTES.ACID;

var AUDIO_FILES = {
    PIANO: "sounds/piano.mp3",
    VIOLIN: "sounds/violin.mp3",
    BALLOONS:"sounds/balloons.mp3",
};

var ANIMATORS = {
    LASER: LaserAnimator,
    BLIP: BlipAnimator,
    SCREEN: ScreenAnimator
}

// Each entry here represents:
//  1  -  An animator for the fancy effects
//  2  -  A color for the slider/rectangles/effects
//  3  -  An audio file for the slider
//  4  -  Vector corresponding to the slider's 0 position (off) in percentage of total canvas size
//  5  -  Vector corresponding to the slider's 1.0 position (on) in percentage of total canvas size
//  6  -  Number in the range [0, 1.0] representing the starting point between the 0 and 100 positions.
//  7+ -  A series of rectangles, where the position is a pixel offset from the anchor, and the size is in pixels
var RECTANGLES = [
    [
        ANIMATORS.LASER,
        PALETTE[1],
        AUDIO_FILES.PIANO,
        new V(0.4, 0.5),
        new V(0.6, 0.5),
        0.5,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
    [
        ANIMATORS.BLIP,
        PALETTE[3],
        AUDIO_FILES.VIOLIN,
        new V(0.2, 0.7),
        new V(0.4, 0.7),
        0.5,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-30, 27), new V(125, 25)),
    ],
    [
        ANIMATORS.SCREEN,
        PALETTE[4],
        AUDIO_FILES.BALLOONS,
        new V(0.6, 0.3),
        new V(0.8, 0.3),
        0.5,
        new Rectangle(new V(-25, -25), new V(75, 75)),
        new Rectangle(new V(-33, -33), new V(25, 25)),
    ],
];