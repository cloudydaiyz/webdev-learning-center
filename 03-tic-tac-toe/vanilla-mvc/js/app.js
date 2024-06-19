import Store from "./store.js";
import View from "./view.js";

/**
 * Configuration array of Players
 */
const players = [
    {
        id: 1,
        name: 'Player 1',
        iconClass: 'fa-x',
        colorClass: 'turquoise'
    },
    {
        id: 2,
        name: 'Player 2',
        iconClass: 'fa-o',
        colorClass: 'yellow'
    }
]

function init() {
    const view = new View();
    const store = new Store('live-t3-storage-key', players);

    // When current tab state changes
    store.addEventListener('statechange', () => {
        view.render(store.game, store.stats);
    });

    // Update the view if the storage is updated from another tab -- this allows 
    // for people to play on multiple tabs
    window.addEventListener('storage', () => {
        console.log('state changed from another tab');
        view.render(store.game, store.stats);
    });

    // First load of the document
    view.render(store.game, store.stats);

    view.bindGameResetEvent(event => {
        store.reset();
    });

    view.bindNewRoundEvent(event => {
        store.newRound();
    });

    view.bindPlayerMoveEvent(square => {
        const existingMove = store.game.moves.find(move => move.squareId === +square.id);

        if(existingMove) {
            return;
        }

        // Advance to the next state by pushing a move to the moves array
        store.playerMove(+square.id);
    });
}

window.addEventListener("load", init());