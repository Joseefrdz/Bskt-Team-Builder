export interface PlayersApiResponse {
    get: string
    parameters: Parameters
    errors: any[]
    results: number
    response: PlayerResponse[]
}

export interface Parameters {
    team: string
    season: string
}

export interface PlayerResponse {
    id: number
    name: string
    number?: string
    country?: string
    position?: string
    age?: number
}
