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
  public teamId: number | string | null = null; // Para el ngModel del select de equipos
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
    // Aseguramos que this.teamId se evalúe como cadena para trim(), incluso si es número
    if (this.teamId !== null && String(this.teamId).trim() !== '' && this.teams && this.teams.length > 0) {
      const numericTeamId = Number(this.teamId);
      if (isNaN(numericTeamId)) {
        this.players = [];
        this.currentTeamLogo = undefined;
        return;
      }
      const selectedTeam = this.teams.find(team => team.id === numericTeamId);
      if (selectedTeam) {
        // Verificamos explícitamente la propiedad logo
        if (selectedTeam.logo && typeof selectedTeam.logo === 'string' && selectedTeam.logo.trim() !== '') {
          this.currentTeamLogo = selectedTeam.logo;
        } else {
          this.currentTeamLogo = undefined;
        }
        this.getPlayersByTeam(numericTeamId);
      } else {
        this.currentTeamLogo = undefined;
        this.players = []; // Limpiar jugadores si el equipo no se encuentra
      }
    } else {
      this.players = [];
      this.currentTeamLogo = undefined;
      let reason = '';
      if (this.teamId === null || String(this.teamId).trim() === '') reason += ' teamId es null o vacío;';
      if (!this.teams || this.teams.length === 0) reason += ' this.teams está vacío o no definido;';
    }
  }

  getPlayersByTeam(teamId: number | string): void {
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
    if (!posicion) return 'N/A';

    switch (posicion) {
      case 'Base': return 'PG'; // Point Guard
      case 'Escolta': return 'SG'; // Shooting Guard
      case 'Alero': return 'SF'; // Small Forward
      case 'Ala-Pívot': return 'PF'; // Power Forward
      case 'Pívot': return 'C'; // Center
      default: return posicion.substring(0, 3).toUpperCase(); // Devuelve las primeras 3 letras si no coincide
    }
  }
  getPlayerPositionColor(position: string | undefined): string {
    if (!position) return '#CCCCCC'; // Un color por defecto
    return this.positionColor[position] || this.positionColor[this.abreviarPosicion(position)] || '#CCCCCC';
  }

  //Método para iniciar el arrastre del jugador
  onPlayerDragStart(event: DragEvent, player: PlayerResponse): void {
    if (event.dataTransfer) {
      console.log('[onPlayerDragStart] Valor de this.currentTeamLogo justo antes de crear dataToTransfer:', this.currentTeamLogo);
      const dataToTransfer = {
        ...player,
        teamLogo: this.currentTeamLogo // Añade el logo del equipo actual
      };

      console.log('Iniciando arrastre de jugador:', player.name, 'con logo:', dataToTransfer.teamLogo);
      event.dataTransfer.setData(
        'application/json',
        JSON.stringify(dataToTransfer)
      );
      event.dataTransfer.effectAllowed = 'move';
    } else {
      console.error('DataTransfer no está disponible en este navegador.');
    }
  }

}
