export interface LeagueCountry {
    id: number;
    name: string;
    code: string | null;
    flag: string | null;
}

export interface LeagueSeasonCoverageGamesStatistics {
    teams: boolean;
    players: boolean;
}

export interface LeagueSeasonCoverageGames {
    statistics: LeagueSeasonCoverageGamesStatistics;
}

export interface LeagueSeasonCoverage {
    games: LeagueSeasonCoverageGames;
    standings: boolean;
    players: boolean;
    odds: boolean;
}

export interface LeagueSeason {
    season: number;
    start: string;
    end: string;
    coverage: LeagueSeasonCoverage;
    // La propiedad 'current' no está en tu JSON de ejemplo, la elimino.
    // current: boolean; // Si la API devuelve esto en otros casos, puedes añadirlo de nuevo.
}

export interface LeagueResponse {
    id: number;
    name: string;
    type: string;
    logo: string;
    country: LeagueCountry;
    seasons: LeagueSeason[];
}

export interface LeaguesApiResponse {
    get: string;
    parameters: any[];
    errors: any[];
    results: number;
    response: LeagueResponse[];
}