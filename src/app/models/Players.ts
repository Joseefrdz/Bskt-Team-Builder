
export interface Player {
    id: number;
    name: string;
    number: string;
    country: string;
    position: string; // "Guard", "Forward", "Center"
    age: number;
    photo?: string; // La API te la devuelve, pero no en tu JSON de ejemplo directamente en 'player'.
    // Se encuentra en 'statistics[0].player.photo'. Lo gestionaremos en el componente.
}

export interface TeamStat {
    id: number;
    name: string;
    logo: string;
}

export interface GameStat {
    minutes: string | null;
    points: string | null;
    assists: string | null;
    rebounds: string | null;
    steals: string | null;
    blocks: string | null;
    turnovers: string | null;
    fouls: string | null;
    fastBreakPoints: string | null;
    pointsInPaint: string | null;
    secondChancePoints: string | null;
    teamTurnovers: string | null;
    playerTurnovers: string | null;
    fgp: string | null; // Field Goal Percentage
    tpp: string | null; // 3 Point Percentage
    ftp: string | null; // Free Throw Percentage
}

export interface Statistic {
    team: TeamStat;
    games: GameStat;
}

export interface PlayerResponse {
    id: number; // Este ID principal es el del jugador para la respuesta general
    player: Player; // Contiene los datos básicos del jugador (id, name, etc.)
    statistics: Statistic[]; // Contiene las estadísticas, incluyendo team y games
}

export interface PlayersApiResponse { // Cambiado de ApiResponse a PlayersApiResponse para mayor claridad
    get: string;
    parameters: {
        team: string;
        season: string;
    };
    errors: any[];
    results: number;
    response: PlayerResponse[];
}