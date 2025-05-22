export interface TeamCountry {
    id: number;
    name: string;
    code: string;
    flag: string;
}

export interface TeamResponse {
    id: number;
    name: string;
    logo: string;
    nationnal: boolean;
    country: TeamCountry;
}

export interface TeamsApiResponse {
    get: string;
    parameters: {
        season: string;
        league: string;
    };
    errors: any[];
    results: number;
    response: TeamResponse[];
}