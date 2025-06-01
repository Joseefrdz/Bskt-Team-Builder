export interface TeamsApiResponse {
    get: string
    parameters: Parameters
    errors: any[]
    results: number
    response: TeamsResponse[]
}

export interface Parameters {
    season: string
    league: string
}

export interface TeamsResponse {
    id: number
    name: string
    logo: string
    nationnal: boolean
    country: Country
}

export interface Country {
    id: number
    name: string
    code: string
    flag: string
}
