import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [gameState, setGameState] = useState({
        isLive: false,
        currentPeriod: 0,
        activePlayers: [],
        benchPlayers: [],
        plannedRotation: null,
        score: {
            team: 0,
            opponent: 0,
            byQuarter: [
                { team: 0, opponent: 0 },
                { team: 0, opponent: 0 },
                { team: 0, opponent: 0 },
                { team: 0, opponent: 0 }
            ]
        },
        playerStats: {},
        scoringEvents: [],
        actualParticipation: {}, // { periodIndex: [playerId, playerId...] }
        playerIndices: {} // Map playerId -> original roster index
    });

    const startGame = useCallback((roster, rotationMatrix) => {
        // Initialize active players based on first period of rotation
        const activePlayers = [];
        const benchPlayers = [];
        const playerIndices = {};

        roster.forEach((player, index) => {
            playerIndices[player.id] = index;
            const isPlaying = rotationMatrix[index] && rotationMatrix[index][0] === 1;
            if (isPlaying) {
                activePlayers.push(player);
            } else {
                benchPlayers.push(player);
            }
        });

        // Initialize player stats
        const playerStats = {};
        roster.forEach(player => {
            playerStats[player.id] = {
                points: 0,
                periodsPlayed: 0,
                actualPeriodsPlayed: 0
            };
        });

        // Record initial participation
        const initialParticipation = {
            0: activePlayers.map(p => p.id)
        };

        setGameState({
            isLive: true,
            currentPeriod: 0,
            activePlayers,
            benchPlayers,
            plannedRotation: rotationMatrix,
            score: {
                team: 0,
                opponent: 0,
                byQuarter: [
                    { team: 0, opponent: 0 },
                    { team: 0, opponent: 0 },
                    { team: 0, opponent: 0 },
                    { team: 0, opponent: 0 }
                ]
            },
            playerStats,
            scoringEvents: [],
            actualParticipation: initialParticipation,
            playerIndices
        });
    }, []);

    const swapPlayer = useCallback((courtPlayerId, benchPlayerId) => {
        setGameState(prev => {
            const newActive = prev.activePlayers.map(p =>
                p.id === courtPlayerId ? prev.benchPlayers.find(bp => bp.id === benchPlayerId) : p
            );
            const newBench = prev.benchPlayers.map(p =>
                p.id === benchPlayerId ? prev.activePlayers.find(ap => ap.id === courtPlayerId) : p
            );

            // Update participation for current period
            const currentParticipation = prev.actualParticipation[prev.currentPeriod] || [];
            const newParticipation = [...new Set([...currentParticipation, benchPlayerId])];

            return {
                ...prev,
                activePlayers: newActive,
                benchPlayers: newBench,
                actualParticipation: {
                    ...prev.actualParticipation,
                    [prev.currentPeriod]: newParticipation
                }
            };
        });
    }, []);

    const addScore = useCallback((playerId, points) => {
        setGameState(prev => {
            const quarter = Math.floor(prev.currentPeriod / 2);
            const isOpponent = playerId === 'opponent';

            const newScore = { ...prev.score };
            const newByQuarter = [...prev.score.byQuarter];

            if (isOpponent) {
                newScore.opponent += points;
                newByQuarter[quarter] = {
                    ...newByQuarter[quarter],
                    opponent: newByQuarter[quarter].opponent + points
                };
            } else {
                newScore.team += points;
                newByQuarter[quarter] = {
                    ...newByQuarter[quarter],
                    team: newByQuarter[quarter].team + points
                };
            }

            newScore.byQuarter = newByQuarter;

            const newPlayerStats = { ...prev.playerStats };
            if (!isOpponent && newPlayerStats[playerId]) {
                newPlayerStats[playerId] = {
                    ...newPlayerStats[playerId],
                    points: newPlayerStats[playerId].points + points
                };
            }

            const newEvent = {
                period: prev.currentPeriod,
                playerId,
                points,
                timestamp: Date.now()
            };

            return {
                ...prev,
                score: newScore,
                playerStats: newPlayerStats,
                scoringEvents: [...prev.scoringEvents, newEvent]
            };
        });
    }, []);

    const nextPeriod = useCallback(() => {
        setGameState(prev => {
            if (prev.currentPeriod >= 7) return prev; // Max 8 periods

            const newPeriod = prev.currentPeriod + 1;

            // Update actual periods played for current active players
            const newPlayerStats = { ...prev.playerStats };
            prev.activePlayers.forEach(player => {
                if (newPlayerStats[player.id]) {
                    newPlayerStats[player.id] = {
                        ...newPlayerStats[player.id],
                        actualPeriodsPlayed: newPlayerStats[player.id].actualPeriodsPlayed + 1
                    };
                }
            });

            // Get planned rotation for next period
            const allPlayers = [...prev.activePlayers, ...prev.benchPlayers];
            const newActive = [];
            const newBench = [];

            allPlayers.forEach(player => {
                // Use the stored original index to look up the plan
                const originalIndex = prev.playerIndices[player.id];
                const isPlaying = prev.plannedRotation[originalIndex] && prev.plannedRotation[originalIndex][newPeriod] === 1;

                if (isPlaying) {
                    newActive.push(player);
                } else {
                    newBench.push(player);
                }
            });

            // Record participation for new period
            const newParticipation = newActive.map(p => p.id);

            return {
                ...prev,
                currentPeriod: newPeriod,
                activePlayers: newActive,
                benchPlayers: newBench,
                playerStats: newPlayerStats,
                actualParticipation: {
                    ...prev.actualParticipation,
                    [newPeriod]: newParticipation
                }
            };
        });
    }, []);

    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isLive: false
        }));
    }, []);

    return (
        <GameContext.Provider value={{
            gameState,
            startGame,
            swapPlayer,
            addScore,
            nextPeriod,
            endGame
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
