export const ROTATIONS = {
    5: {
        periods: 8,
        // Everyone plays all periods
        matrix: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    6: {
        periods: 8,
        // Rolling 5 playing (1 sitting)
        matrix: [
            [0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1]
        ]
    },
    7: {
        periods: 8,
        // Rolling 5 playing (2 sitting)
        matrix: [
            [1, 1, 1, 1, 1, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1],
            [0, 1, 1, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 1, 0] // Wait, let's stick to the rolling generator logic to be safe
        ]
    },
    8: {
        periods: 8,
        // Rolling 5 playing (3 sitting)
        matrix: [
            [1, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1]
        ]
    },
    9: {
        periods: 8,
        // Rolling 5
        matrix: [
            [1, 0, 1, 0, 1, 0, 1, 0], // P1
            [1, 0, 1, 0, 1, 0, 1, 0], // P2
            [1, 0, 1, 0, 1, 0, 1, 0], // P3
            [1, 0, 1, 0, 1, 0, 1, 0], // P4
            [1, 1, 0, 1, 0, 1, 0, 1], // P5
            [0, 1, 0, 1, 0, 1, 0, 1], // P6
            [0, 1, 0, 1, 0, 1, 0, 1], // P7
            [0, 1, 0, 1, 0, 1, 0, 1], // P8
            [0, 1, 1, 0, 0, 1, 0, 0]  // P9 - Manual adjustment needed for 9
        ]
    },
    10: {
        periods: 8,
        // Platoon 5 in 5 out
        matrix: [
            [1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1]
        ]
    },
    11: {
        periods: 8,
        // Rolling 5
        matrix: [
            [1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 0, 1, 0, 0, 1],
            [0, 1, 1, 0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0, 1, 1, 1],
            [0, 0, 1, 1, 1, 1, 1, 1]
        ]
    },
    12: {
        periods: 8,
        // Rolling 5
        matrix: [
            [1, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0, 0, 1, 0],
            [0, 1, 1, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0, 1],
            [0, 0, 0, 1, 1, 1, 1, 1]
        ]
    }
};

// Helper to generate rolling rotations if needed, but hardcoded is safer for now.
// I will manually verify these 9, 11, 12 matrices in my head.
// 9 players: 5 play.
// C1: 1,2,3,4,5.
// C2: 5,6,7,8,9. (Overlap 5? No, 6,7,8,9,1)
// Let's use a function to generate them perfectly.

function generateRollingRotation(players, periods) {
    const matrix = Array(players).fill().map(() => Array(periods).fill(0));
    let current = 0;
    for (let p = 0; p < periods; p++) {
        for (let i = 0; i < 5; i++) {
            matrix[(current + i) % players][p] = 1;
        }
        current = (current + 5) % players;
    }
    return matrix;
}

// Re-generating matrices using the rolling logic
ROTATIONS[7].matrix = generateRollingRotation(7, 8);
ROTATIONS[9].matrix = generateRollingRotation(9, 8);
ROTATIONS[11].matrix = generateRollingRotation(11, 8);
ROTATIONS[12].matrix = generateRollingRotation(12, 8);
