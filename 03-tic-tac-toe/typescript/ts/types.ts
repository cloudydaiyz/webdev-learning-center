export type Player = {
    id: number;
    name: string;
    iconClass: string;
    colorClass: string;
}

export type Move = {
    squareId: number;
    player: Player;
}

export type GameStatus = {
    isComplete: boolean;
    winner: Player | null;
}

export type Game = {
    moves: Move[];
    status: GameStatus;
}

export type GameState = {
    currentGameMoves: Move[];
    history: {
        currentRoundGames: Game[];
        allGames: Game[];
    }
}

export type PlayerWithWins = Player & { wins: number };

export type DerivedStats = {
    playerWithStats: PlayerWithWins[];
    ties: number;
}

export type DerivedGame = {
    moves: Move[];
    currentPlayer: Player;
    status: GameStatus;
}

export type SaveStateCb = (prevState: GameState) => GameState;