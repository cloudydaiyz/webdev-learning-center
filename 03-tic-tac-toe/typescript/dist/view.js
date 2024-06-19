var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _View_instances, _View_updateScoreboard, _View_openModal, _View_closeAll, _View_clearMoves, _View_closeModal, _View_closeMenu, _View_toggleMenu, _View_handlePlayerMove, _View_initializeMoves, _View_setTurnIndicator, _View_qs, _View_qsAll, _View_delegate;
class View {
    constructor() {
        _View_instances.add(this);
        this.$ = {};
        this.$$ = {};
        this.$.menu = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="menu"]');
        this.$.menuItems = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '.items');
        this.$.menuBtn = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="menu-button"]');
        this.$.resetBtn = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="reset-btn"]');
        this.$.newRoundBtn = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="new-round-btn"]');
        this.$.modal = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="modal"]');
        this.$.modalText = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="modal-text"]');
        this.$.modalBtn = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="modal-btn"]');
        this.$.turn = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="turn"]');
        this.$.p1Wins = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="p1-stats"]');
        this.$.p2Wins = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="p2-stats"]');
        this.$.ties = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="ties"]');
        this.$.grid = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="grid"]');
        this.$$.squares = __classPrivateFieldGet(this, _View_instances, "m", _View_qsAll).call(this, '[data-id="square"]');
        // UI only event listeners
        this.$.menuBtn.addEventListener('click', event => {
            __classPrivateFieldGet(this, _View_instances, "m", _View_toggleMenu).call(this);
        });
    }
    render(game, stats) {
        const { playerWithStats, ties } = stats;
        const { moves, currentPlayer, status: { isComplete, winner } } = game;
        __classPrivateFieldGet(this, _View_instances, "m", _View_closeAll).call(this);
        __classPrivateFieldGet(this, _View_instances, "m", _View_clearMoves).call(this);
        __classPrivateFieldGet(this, _View_instances, "m", _View_updateScoreboard).call(this, playerWithStats[0].wins, playerWithStats[1].wins, ties);
        __classPrivateFieldGet(this, _View_instances, "m", _View_initializeMoves).call(this, moves);
        if (isComplete) {
            __classPrivateFieldGet(this, _View_instances, "m", _View_openModal).call(this, winner ? `${winner.name} wins!` : "Tie!");
            return;
        }
        __classPrivateFieldGet(this, _View_instances, "m", _View_setTurnIndicator).call(this, currentPlayer);
    }
    /**
     * Register all the event listeners
     */
    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener('click', handler);
        this.$.modalBtn.addEventListener('click', handler);
    }
    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener('click', handler);
    }
    bindPlayerMoveEvent(handler) {
        __classPrivateFieldGet(this, _View_instances, "m", _View_delegate).call(this, this.$.grid, '[data-id="square"', 'click', handler);
    }
}
_View_instances = new WeakSet(), _View_updateScoreboard = function _View_updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.textContent = `${p1Wins} wins`;
    this.$.p2Wins.textContent = `${p2Wins} wins`;
    this.$.ties.textContent = `${ties} ties`;
}, _View_openModal = function _View_openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.textContent = message;
}, _View_closeAll = function _View_closeAll() {
    __classPrivateFieldGet(this, _View_instances, "m", _View_closeModal).call(this);
    __classPrivateFieldGet(this, _View_instances, "m", _View_closeMenu).call(this);
}, _View_clearMoves = function _View_clearMoves() {
    this.$$.squares.forEach(square => {
        square.replaceChildren();
    });
}, _View_closeModal = function _View_closeModal() {
    this.$.modal.classList.add("hidden");
}, _View_closeMenu = function _View_closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuBtn.classList.remove('border');
    const icon = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, 'i', this.$.menuBtn);
    icon.classList.add('fa-chevron-down');
    icon.classList.remove('fa-chevron-up');
}, _View_toggleMenu = function _View_toggleMenu() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuBtn.classList.toggle('border');
    const icon = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, 'i', this.$.menuBtn);
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}, _View_handlePlayerMove = function _View_handlePlayerMove(square, player) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    square.replaceChildren(icon);
}, _View_initializeMoves = function _View_initializeMoves(moves) {
    this.$$.squares.forEach(square => {
        const existingMove = moves.find(move => move.squareId === +square.id);
        if (existingMove) {
            __classPrivateFieldGet(this, _View_instances, "m", _View_handlePlayerMove).call(this, square, existingMove.player);
        }
    });
}, _View_setTurnIndicator = function _View_setTurnIndicator(player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');
    icon.classList.add('fa-solid', player.colorClass, player.iconClass);
    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;
    this.$.turn.classList.add(player.colorClass);
    this.$.turn.replaceChildren(icon, label);
}, _View_qs = function _View_qs(selector, parent) {
    const el = parent
        ? parent.querySelector(selector)
        : document.querySelector(selector);
    if (!el)
        throw new Error('Could not find elements');
    return el;
}, _View_qsAll = function _View_qsAll(selector) {
    const el = document.querySelectorAll(selector);
    if (!el)
        throw new Error('Could not find elements');
    return el;
}, _View_delegate = function _View_delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
        if (!(event.target instanceof Element)) {
            throw new Error('Event target not found');
        }
        if (event.target.matches(selector)) {
            handler(event.target);
        }
    });
};
export default View;
