export const initialState = {
    homeTeam: {
        name: "Home",
        score: 0,
        fouls: 0,
        timeouts: 5,
        players: [] // { id, number, name, points, fouls, quarters: [bool, bool, bool, bool] }
    },
    guestTeam: {
        name: "Guest",
        score: 0,
        fouls: 0,
        timeouts: 5,
        players: []
    },
    period: 1, // 1, 2, 3, 4
    history: [] // { type: 'score'|'foul', team: 'home'|'guest', player: name, detail: '+2' }
};

export function scoreKeeperReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_TEAM_NAME':
            return {
                ...state,
                [action.team + 'Team']: {
                    ...state[action.team + 'Team'],
                    name: action.name
                }
            };

        case 'ADD_PLAYER':
            const newPlayer = {
                id: Date.now(),
                number: action.number,
                name: action.name,
                points: 0,
                fouls: 0,
                quarters: [false, false, false, false]
            };
            return {
                ...state,
                [action.team + 'Team']: {
                    ...state[action.team + 'Team'],
                    players: [...state[action.team + 'Team'].players, newPlayer]
                }
            };

        case 'REMOVE_PLAYER':
            return {
                ...state,
                [action.team + 'Team']: {
                    ...state[action.team + 'Team'],
                    players: state[action.team + 'Team'].players.filter(p => p.id !== action.id)
                }
            };

        case 'ADD_SCORE':
            // action: { team: 'home'|'guest', playerId, points: 1|2|3 }
            const teamKey = action.team + 'Team';
            const playerIndex = state[teamKey].players.findIndex(p => p.id === action.playerId);
            if (playerIndex === -1) return state;

            const player = state[teamKey].players[playerIndex];
            const updatedPlayer = { ...player, points: player.points + action.points };
            const updatedPlayers = [...state[teamKey].players];
            updatedPlayers[playerIndex] = updatedPlayer;

            return {
                ...state,
                [teamKey]: {
                    ...state[teamKey],
                    score: state[teamKey].score + action.points,
                    players: updatedPlayers
                },
                history: [{
                    id: Date.now(),
                    text: `${action.team === 'home' ? state.homeTeam.name : state.guestTeam.name}: #${player.number} ${player.name} +${action.points}`
                }, ...state.history].slice(0, 50)
            };

        case 'ADD_FOUL':
            // action: { team: 'home'|'guest', playerId }
            const fTeamKey = action.team + 'Team';
            const fPlayerIndex = state[fTeamKey].players.findIndex(p => p.id === action.playerId);
            if (fPlayerIndex === -1) return state;

            const fPlayer = state[fTeamKey].players[fPlayerIndex];
            const updatedFoulPlayer = { ...fPlayer, fouls: Math.min(fPlayer.fouls + 1, 5) };
            const fUpdatedPlayers = [...state[fTeamKey].players];
            fUpdatedPlayers[fPlayerIndex] = updatedFoulPlayer;

            return {
                ...state,
                [fTeamKey]: {
                    ...state[fTeamKey],
                    fouls: state[fTeamKey].fouls + 1,
                    players: fUpdatedPlayers
                },
                history: [{
                    id: Date.now(),
                    text: `${action.team === 'home' ? state.homeTeam.name : state.guestTeam.name}: Foul on #${fPlayer.number} ${fPlayer.name}`
                }, ...state.history].slice(0, 50)
            };

        case 'NEXT_PERIOD':
            let nextPeriod = state.period + 1;
            if (nextPeriod > 4) nextPeriod = 1; // Loop or Game Over logic? Let's loop for simplicity or cap at 4.

            // Reset team fouls on half? usually resets after each quarter or half depending on rules.
            // Rules in image: "Second Half Team Fouls" implies reset at half.
            // Let's reset fouls if moving to Period 1 (new game) or Period 3 (2nd half).
            // Actually standard usage: Reset manually or auto. Let's just track periods.

            return {
                ...state,
                period: nextPeriod,
                history: [{ id: Date.now(), text: `Period ${nextPeriod} Started` }, ...state.history]
            };

        case 'RESET_FOULS':
            return {
                ...state,
                homeTeam: { ...state.homeTeam, fouls: 0 },
                guestTeam: { ...state.guestTeam, fouls: 0 },
                history: [{ id: Date.now(), text: `Team Fouls Reset` }, ...state.history]
            };

        case 'TIMEOUT':
            const tTeamKey = action.team + 'Team';
            if (state[tTeamKey].timeouts <= 0) return state;
            return {
                ...state,
                [tTeamKey]: {
                    ...state[tTeamKey],
                    timeouts: state[tTeamKey].timeouts - 1
                },
                history: [{ id: Date.now(), text: `${state[tTeamKey].name} Timeout` }, ...state.history]
            };

        default:
            return state;
    }
}
