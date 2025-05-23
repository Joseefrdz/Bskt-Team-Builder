import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { SelectorComponent } from './selector/selector.component';
import { PeticionesApiService } from '../peticiones-api.service'
import { LeaguesResponse, Season } from '../models/Leagues';
import { CommonModule } from '@angular/common';
import { PlayerResponse } from '../models/Players';

interface DraggedPlayerDataWithTeamLogo extends PlayerResponse { // Extiende PlayerResponse
  teamLogo?: string; // <-- Añadimos la propiedad para el logo del equipo
}
interface PlayerPosition {
  x: number;
  y: number;
  role?: string;
  color?: string;

  droppedPlayer?: DraggedPlayerDataWithTeamLogo;
  isOccupied: boolean;
  isDragOver: boolean;
  id: string; // Un identificador único para cada slot
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule /* , SelectorComponent (si app-selector está en este template y es standalone) */,
    SelectorComponent
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'], // Este CSS definirá el estilo de la card en el campo
})
export class CreateComponent implements AfterViewInit, OnInit {
  @ViewChild('formationSelect') formationSelect!: ElementRef<HTMLSelectElement>; // Usado para el select de formación

  public playerPositions: PlayerPosition[] = [];

  // Definición de formaciones (como en la respuesta anterior)
  private formationsData: {
    [key: string]: Omit<
      PlayerPosition,
      'id' | 'isOccupied' | 'isDragOver' | 'droppedPlayer'
    >[];
  } = {
      '2-1-2': [ // Zona 2-1-2 (dos arriba, uno en el medio, dos abajo)
        // Coordenadas ajustadas para simular la formación defensiva
        // Los jugadores se distribuirán en la media cancha defensiva.
        { x: 75, y: 30, role: 'ESC', color: '#885B89' }, // Arriba izquierda (defensor exterior)
        { x: 75, y: 70, role: 'BS', color: '#405BA4' }, // Arriba derecha (defensor exterior)
        { x: 55, y: 50, role: 'ALA', color: '#AEA503' }, // Medio (poste alto)
        { x: 25, y: 20, role: 'AP', color: '#42713F' }, // Abajo izquierda (esquina o poste bajo)
        { x: 25, y: 80, role: 'PVT', color: '#91211B' }, // Abajo derecha (esquina o poste bajo)
      ],
      '1-2-2': [ // Zona 1-2-2 (uno arriba, dos en el medio, dos abajo)
        { x: 85, y: 50, role: 'BS', color: '#405BA4' }, // Arriba (punta)
        { x: 60, y: 25, role: 'ESC', color: '#885B89' }, // Medio izquierda (ala/codo)
        { x: 60, y: 75, role: 'ALA', color: '#AEA503' }, // Medio derecha (ala/codo)
        { x: 25, y: 20, role: 'AP', color: '#42713F' }, // Abajo izquierda (esquina o bajo)
        { x: 25, y: 80, role: 'PVT', color: '#91211B' }, // Abajo derecha (esquina o bajo)
      ],
      '1-1-3': [ // Zona 1-1-3 (uno arriba, uno en el poste alto, tres abajo)
        { x: 85, y: 50, role: 'BS', color: '#405BA4' }, // Arriba (punta)
        { x: 55, y: 50, role: 'ESC', color: '#885B89' }, // Medio (poste alto)
        { x: 25, y: 15, role: 'ALA', color: '#AEA503' }, // Abajo izquierda (esquina profunda)
        { x: 15, y: 50, role: 'AP', color: '#42713F' }, // Abajo centro (cerca del aro)
        { x: 25, y: 85, role: 'PVT', color: '#91211B' }, // Abajo derecha (esquina profunda)
      ],
      '1-3-1': [ // Zona 1-3-1 (uno arriba, tres en línea media, uno abajo)
        { x: 85, y: 50, role: 'BS', color: '#405BA4' }, // Arriba (punta)
        { x: 60, y: 15, role: 'ESC', color: '#885B89' }, // Ala izquierda (parte de los '3')
        { x: 50, y: 50, role: 'AP', color: '#42713F' }, // Poste alto (centro de los '3')
        { x: 60, y: 85, role: 'ALA', color: '#AEA503' }, // Ala derecha (parte de los '3')
        { x: 25, y: 50, role: 'PVT', color: '#91211B' }, // Poste bajo (el '1' de abajo)
      ],
      '2-3': [ // Zona 2-3 (dos arriba, tres abajo) - La zona más común
        { x: 75, y: 30, role: 'BS', color: '#405BA4' }, // Arriba izquierda
        { x: 75, y: 70, role: 'ESC', color: '#885B89' }, // Arriba derecha
        { x: 25, y: 15, role: 'ALA', color: '#AEA503' }, // Abajo izquierda (esquina)
        { x: 15, y: 50, role: 'AP', color: '#42713F' }, // Abajo centro (Pívot defensivo)
        { x: 25, y: 85, role: 'PVT', color: '#91211B' }, // Abajo derecha (esquina)
      ],
      '3-2': [ // Zona 3-2 (tres arriba, dos abajo)
        { x: 75, y: 50, role: 'BS', color: '#405BA4' }, // Central arriba
        { x: 75, y: 20, role: 'ESC', color: '#885B89' }, // Ala izquierda (arriba)
        { x: 75, y: 80, role: 'ALA', color: '#AEA503' }, // Ala derecha (arriba)
        { x: 25, y: 35, role: 'AP', color: '#42713F' }, // Abajo izquierda
        { x: 25, y: 65, role: 'PVT', color: '#91211B' }, // Abajo derecha
      ],
    };


  private apiService: PeticionesApiService = inject(PeticionesApiService);
  public leagues: LeaguesResponse[] = [];
  public selectedLeagueId: number | null = null;
  public filteredLeagues: LeaguesResponse[] = [];//Para filtrar las ligas que no sean de 2023 en el selector

  ngOnInit(): void {
    this.getLeagues();
  }

  getLeagues(): void {
    this.apiService.getLeagues().subscribe({
      next: (data) => {
        if (data && data.response) {
          this.leagues = data.response;
          this.filteredLeagues = this.leagues.filter(league =>
            this.hasSeason2023(league.seasons)
          );
          console.log('Ligas filtradas obtenidas:', this.filteredLeagues);
        }
      },
      error: (err) => {
        console.error('Error al obtener las ligas:', err);
      }
    });
  }

  // Event listener para el select de Liga
  onLeagueSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedLeagueId = value ? parseInt(value, 10) : null;
    console.log('Liga seleccionada (ID):', this.selectedLeagueId);
  }

  private hasSeason2023(seasons: Season[]): boolean {
    if (!seasons || seasons.length === 0) {
      return false;
    }
    // Comprueba si alguna de las temporadas en el array es 2023
    return seasons.some(season => season.season === 2023);
  }

  // Event listener para el select de formación
  onFormationSelectChange(event: Event): void {
    const selectedFormationKey = (event.target as HTMLSelectElement).value;
    this.updatePlayerPositions(selectedFormationKey);
  }

  ngAfterViewInit(): void {
    // Conectar el select de formaciones si no se usa (change) en el template
    // o para cargar una formación por defecto
    const selectElement = document.getElementById('select1') as HTMLSelectElement;
    if (selectElement) {
      selectElement.addEventListener('change', (event) =>
        this.onFormationSelectChange(event)
      );
      // Para cargar una formación inicial si alguna está seleccionada por defecto
      if (
        selectElement.value &&
        selectElement.value !== 'SELECCIONA UNA FORMACIÓN'
      ) {
        this.updatePlayerPositions(selectElement.value);
      }
    }
  }

  updatePlayerPositions(formationKey: string): void {

    const formationBaseData = this.formationsData[formationKey];

    if (formationBaseData) {
      this.playerPositions = formationBaseData.map((pos, index) => ({
        ...pos,
        id: `${formationKey}-slot-${index}`,
        isOccupied: false,
        isDragOver: false,
        droppedPlayer: undefined,
      }));
    } else {
      this.playerPositions = [];
    }
  }

  // --- Métodos para Drag and Drop ---
  onDragOver(event: DragEvent, position: PlayerPosition): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    position.isDragOver = true;
  }

  onDragLeave(event: DragEvent, position: PlayerPosition): void {
    position.isDragOver = false;
  }

  onDrop(event: DragEvent, targetPosition: PlayerPosition): void {
    event.preventDefault();
    targetPosition.isDragOver = false;

    if (event.dataTransfer) {
      const playerDataString = event.dataTransfer.getData('application/json');
      if (playerDataString) {
        try {
          // Parseamos el JSON a un objeto PlayerResponse completo
          const playerData: DraggedPlayerDataWithTeamLogo = JSON.parse(playerDataString); //
          targetPosition.droppedPlayer = playerData; //
          targetPosition.isOccupied = true; //
          console.log(`Jugador "${playerData.name}" (Equipo Logo: ${playerData.teamLogo || 'N/A'}) soltado en la posición: ${targetPosition.role}`);
        } catch (e) {
          console.error('Error al parsear datos del jugador:', e);
        }
      }
    }
  }

  // Opcional: Método para limpiar un slot si se implementa un botón para ello
  clearPlayerSlot(position: PlayerPosition): void {
    position.droppedPlayer = undefined;
    position.isOccupied = false;
  }
}
