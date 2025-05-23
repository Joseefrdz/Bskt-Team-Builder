import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayersApiResponse } from './models/Players';
import { LeaguesApiResponse } from './models/Leagues';
import { TeamsApiResponse } from './models/Teams';

@Injectable({
  providedIn: 'root'
})
export class PeticionesApiService {

  constructor() { }

  private apiKey: string = "baf64677208eb7c745ce554a34938615";
  private apiHost: string = "v1.basketball.api-sports.io";
  private apiUrl: string = "https://v1.basketball.api-sports.io/";
  private http: HttpClient = inject(HttpClient);

  // Método para obtener ligas
  public getLeagues(): Observable<LeaguesApiResponse> {
    return this.http.get<LeaguesApiResponse>(this.apiUrl + "leagues", {
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost
      }
    });
  }

  // Método para obtener equipos por liga
  public getTeamsByLeague(leagueId: number): Observable<TeamsApiResponse> {
    return this.http.get<TeamsApiResponse>(this.apiUrl + `teams?league=${leagueId}&season=2023`, {
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost
      }
    });
  }

  // Método para obtener jugadores por equipo
  public getPlayers(teamId: number): Observable<PlayersApiResponse> {
    return this.http.get<PlayersApiResponse>(this.apiUrl + `players?team=${teamId}&season=2023`, {
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost
      }
    });
  }
}