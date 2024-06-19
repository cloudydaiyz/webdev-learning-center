var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Store_instances, _Store_getState, _Store_saveState;
const initialValue = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: []
    }
};
class Store extends EventTarget {
    constructor(storageKey, players) {
        super();
        _Store_instances.add(this);
        this.storageKey = storageKey;
        this.players = players;
    }
    get stats() {
        const state = __classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this);
        return {
            playerWithStats: this.players.map(player => {
                const wins = state.history.currentRoundGames
                    .filter(game => { var _a; return ((_a = game.status.winner) === null || _a === void 0 ? void 0 : _a.id) === player.id; })
                    .length;
                return Object.assign(Object.assign({}, player), { wins });
            }),
            ties: state.history.currentRoundGames
                .filter(game => game.status.winner === null)
                .length
        };
    }
    get game() {
        const state = __classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this);
        const currentPlayer = this.players[state.currentGameMoves.length % 2];
        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9]
        ];
        let winner = null;
        for (const player of this.players) {
            const selectedSquareIds = state.currentGameMoves
                .filter(move => move.player.id === player.id)
                .map(move => move.squareId);
            for (const pattern of winningPatterns) {
                if (pattern.every(v => selectedSquareIds.includes(v))) {
                    winner = player;
                }
            }
        }
        return {
            moves: state.currentGameMoves,
            currentPlayer,
            status: {
                isComplete: winner != null || state.currentGameMoves.length === 9,
                winner
            }
        };
    }
    playerMove(squareId) {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer
        });
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, stateClone);
    }
    reset() {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        const { status, moves } = this.game;
        if (status.isComplete) {
            stateClone.history.currentRoundGames.push({
                moves,
                status
            });
        }
        stateClone.currentGameMoves = [];
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, stateClone);
    }
    newRound() {
        this.reset();
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, stateClone);
    }
}
_Store_instances = new WeakSet(), _Store_getState = function _Store_getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
}, _Store_saveState = function _Store_saveState(stateOrFn) {
    const prevState = __classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this);
    let newState;
    switch (typeof stateOrFn) {
        case 'function':
            newState = stateOrFn(prevState);
            break;
        case 'object':
            newState = stateOrFn;
            break;
        default:
            throw new Error('Invalid argument passed to saveState');
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event('statechange'));
};
export default Store;
