import { Component, inject, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TeamsResponse } from '../../models/Teams';
import { PeticionesApiService } from '../../peticiones-api.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { PlayerResponse } from '../../models/Players';

@Component({
  selector: 'app-selector',
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css',
})
export class SelectorComponent implements OnInit, OnChanges {

  // response: ApiResponse[] = [];
  // playerStatistics: Statistic[] | null = null;
  @Input() leagueId: number | null = null;

  private apiService: PeticionesApiService = inject(PeticionesApiService);
  public teams: TeamsResponse[] = []; // Para almacenar los equipos
  public teamId: number | null = null; // Para el ngModel del select de equipos
  public players: PlayerResponse[] = []; // Para almacenar los jugadores
  public currentTeamLogo: string | undefined; //Para almacenar el logo del equipo seleccionado

  positionColor: Record<string, string> = {
    Attacker: '#91211B',
    Defender: '#42713F',
    Goalkeeper: '#405BA4',
    Midfielder: '#AEA503',
  };

  ngOnInit(): void {
    this.teamId = null; // Asegura que el valor inicial sea null
  }

  // get tmId(): number | null {
  //   return this.teamId;
  // }

  // set tmId(value: number | null) {
  //   this.teamId = value;
  //   if (value !== null && value > 0) {
  //     const selectedTeam = this.teams.find(team => team.id === value);
  //     this.currentTeamLogo = selectedTeam?.logo;
  //     console.log('teamId changed:', value);
  //   } else {
  //     this.players = [];
  //     this.currentTeamLogo = undefined;
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leagueId'] && changes['leagueId'].currentValue !== changes['leagueId'].previousValue) {
      if (this.leagueId !== null && this.leagueId !== 0) { // Asegúrate de que el ID sea válido
        this.getTeamsByLeague(this.leagueId);
      } else {
        this.teams = [];
        this.players = [];
        this.teamId = null; // Reinicia la selección
        this.currentTeamLogo = undefined;
      }
    }
  }

  getTeamsByLeague(leagueId: number): void {
    this.apiService.getTeamsByLeague(leagueId).subscribe({
      next: (data) => {
        if (data && data.response) {
          this.teams = data.response;
          console.log('Equipos obtenidos:', this.teams);
          this.teamId = null;
          this.players = [];
          this.currentTeamLogo = undefined;
        }
      },
      error: (err) => {
        console.error(`Error al obtener equipos para la liga ${leagueId}:`, err);
        this.teams = []; // En caso de error limpia la lista de equipos
        this.teamId = null; // Reinicia la selección
        this.currentTeamLogo = undefined;
      }
    });
  }

  onTeamSelected(): void {
    console.log('Equipo seleccionado (ID):', this.teamId);
    if (this.teamId !== null && this.teams.length > 0) {
      const selectedTeam = this.teams.find(team => team.id === this.teamId);
      // Solo actualizamos currentTeamLogo si se encontró un equipo.
      // Si selectedTeam es undefined, currentTeamLogo será undefined.
      this.currentTeamLogo = selectedTeam?.logo;
      console.log('Logo del equipo seleccionado (antes de getPlayersByTeam):', this.currentTeamLogo);

      this.getPlayersByTeam(this.teamId);
    } else {
      // Si no hay equipo seleccionado o los equipos no están cargados, limpiar.
      this.players = [];
      this.currentTeamLogo = undefined;
      console.log('No hay equipo seleccionado o equipos no cargados. currentTeamLogo limpiado.');
    }
  }

  getPlayersByTeam(teamId: number): void {
    this.apiService.getPlayers(teamId).subscribe({
      next: (data) => {
        if (data && data.response) {
          this.players = data.response;
          console.log('Jugadores obtenidos:', this.players);
        } else {
          this.players = [];
          console.log('No se encontraron jugadores para este equipo o respuesta vacía.');
        }
      },
      error: (err) => {
        console.error(`Error al obtener jugadores para el equipo ${teamId}:`, err);
        this.players = []; // En caso de error, limpia la lista
      }
    });
  }

  // Función para abreviar la posición
  abreviarPosicion(posicion: string): string {
    switch (posicion) {
      case 'Attacker':
        return 'DL'; // Delantero
      case 'Defender':
        return 'DF'; // Defensa
      case 'Midfielder':
        return 'MD'; // Mediocampista
      case 'Goalkeeper':
        return 'POR'; // Portero
      default:
        return '  ';
    }
  }

  //Método para iniciar el arrastre del jugador
  onPlayerDragStart(event: DragEvent, player: PlayerResponse): void {
    if (event.dataTransfer) {
      // Envía toda la información del jugador
      // const playerData: PlayerResponse = player;
      const dataToTransfer = {
        ...player, // Todos los datos del jugador (spread operator)
        teamLogo: this.currentTeamLogo // Añade el logo del equipo actual
      };

      event.dataTransfer.setData(
        'application/json',
        JSON.stringify(dataToTransfer)
      );

      event.dataTransfer.effectAllowed = 'move'; // O 'copy', dependiendo de tu lógica
    } else {
      console.error('DataTransfer no está disponible en este navegador.');
    }
  }

}
