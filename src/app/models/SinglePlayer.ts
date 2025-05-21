export interface SinglePlayerApiResponse {
    get: string;
    parameters: Parameters;
    errors: any[];
    results: number;
    paging: Paging;
    response: SinglePlayerResponse[]; // An array, but will usually contain only one element
}

export interface Parameters {
    id: string; // Changed to string to match the JSON
    season: string;
}

export interface Paging {
    current: number;
    total: number;
}

export interface SinglePlayerResponse {
    player: Player;
    statistics: Statistic[];
}

export interface Player {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: Birth;
    nationality: string;
    height?: string;
    weight?: string;
    injured: boolean;
    photo: string;
}

export interface Birth {
    date: string;
    place: string;
    country: string;
}

export interface Statistic {
    team: Team;
    league: League;
    games: Games;
    substitutes: Substitutes;
    shots: Shots;
    goals: Goals;
    passes: Passes;
    tackles: Tackles;
    duels: Duels;
    dribbles: Dribbles;
    fouls: Fouls;
    cards: Cards;
    penalty: Penalty;
}

export interface Team {
    id: number;
    name: string;
    logo: string;
}

export interface League {
    id: number | null; // Allow null for league.id
    name: string | null; // Allow null for league.name
    country: string | null; // Allow null for league.country
    logo: string | null; // Allow null for league.logo
    flag: string | null; // Allow null for league.flag
    season: number;
}

export interface Games {
    appearences: number | null;
    lineups: number | null;
    minutes: number | null;
    number: number | null; // Keep as number | null
    position: string;
    rating: string | null;
    captain: boolean;
}

export interface Substitutes {
    in: number | null;
    out: number | null;
    bench: number | null;
}

export interface Shots {
    total: number | null;
    on: number | null;
}

export interface Goals {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null; // Keep as number | null
}

export interface Passes {
    total: number | null;
    key: number | null;
    accuracy: number | null;
}

export interface Tackles {
    total: number | null;
    blocks: number | null;
    interceptions: number | null;
}

export interface Duels {
    total: number | null;
    won: number | null;
}

export interface Dribbles {
    attempts: number | null;
    success: number | null;
    past: number | null; // Keep as number | null
}

export interface Fouls {
    drawn: number | null;
    committed: number | null;
}

export interface Cards {
    yellow: number | null;
    yellowred: number | null;
    red: number | null;
}

export interface Penalty {
    won: number | null; // Keep as number | null
    commited: number | null; // Keep as number | null
    scored: number | null;
    missed: number | null;
    saved: number | null; // Keep as number | null
}