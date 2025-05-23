export interface LeaguesApiResponse {
    get: string
    parameters: any[]
    errors: any[]
    results: number
    response: LeaguesResponse[]
}

export interface LeaguesResponse {
    id: number
    name: string
    type: string
    logo: string
    country: Country
    seasons: Season[]
}

export interface Country {
    id: number
    name: string
    code?: string
    flag?: string
}

export interface Season {
    season: any
    start: string
    end: string
    coverage: Coverage
}

export interface Coverage {
    games: Games
    standings: boolean
    players: boolean
    odds: boolean
}

export interface Games {
    statistics: Statistics
}

export interface Statistics {
    teams: boolean
    players: boolean
}
