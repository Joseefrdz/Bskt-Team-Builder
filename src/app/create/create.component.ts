import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SelectorComponent } from './selector/selector.component';
import { CommonModule } from '@angular/common';

// Interfaz para los datos del jugador que se arrastran
interface DraggedPlayerData {
  id: number;
  name: string;
  photo: string;
} // Interfaz actualizada para las posiciones en el campo
interface PlayerPosition {
  x: number;
  y: number;
  role?: string;
  color?: string; // Color original del slot/placeholder

  droppedPlayer?: DraggedPlayerData;
  isOccupied: boolean;
  isDragOver?: boolean;
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
export class CreateComponent implements AfterViewInit {
  @ViewChild('formationSelect') formationSelect!: ElementRef<HTMLSelectElement>; // Usado para el select de formación

  public playerPositions: PlayerPosition[] = [];

  // Definición de formaciones (como en la respuesta anterior)
  private formationsData: {
    [key: string]: Omit<
      PlayerPosition,
      'id' | 'isOccupied' | 'isDragOver' | 'droppedPlayer'
    >[];
  } = {
    '4-3-3': [
      { x: 5, y: 50, role: 'POR', color: '#405BA4' },
      { x: 20, y: 20, role: 'LD', color: '#42713F' },
      { x: 20, y: 40, role: 'DFC', color: '#42713F' },
      { x: 20, y: 60, role: 'DFC', color: '#42713F' },
      { x: 20, y: 80, role: 'LI', color: '#42713F' },
      { x: 45, y: 30, role: 'MC', color: '#AEA503' },
      { x: 45, y: 50, role: 'MC', color: '#AEA503' },
      { x: 45, y: 70, role: 'MC', color: '#AEA503' },
      { x: 70, y: 25, role: 'ED', color: '#91211B' },
      { x: 70, y: 50, role: 'DC', color: '#91211B' },
      { x: 70, y: 75, role: 'EI', color: '#91211B' },
    ],
    // ... (otras formaciones como 4-4-2, 4-2-3-1, 3-5-2, 5-3-2)
    '4-4-2': [
      { x: 5, y: 50, role: 'POR', color: '#405BA4' },
      { x: 20, y: 20, role: 'LD', color: '#42713F' },
      { x: 20, y: 40, role: 'DFC', color: '#42713F' },
      { x: 20, y: 60, role: 'DFC', color: '#42713F' },
      { x: 20, y: 80, role: 'LI', color: '#42713F' },
      { x: 45, y: 15, role: 'MD', color: '#AEA503' },
      { x: 45, y: 40, role: 'MC', color: '#AEA503' },
      { x: 45, y: 60, role: 'MC', color: '#AEA503' },
      { x: 45, y: 85, role: 'MI', color: '#AEA503' },
      { x: 70, y: 35, role: 'DC', color: '#91211B' },
      { x: 70, y: 65, role: 'DC', color: '#91211B' },
    ],
    '4-2-3-1': [
      { x: 5, y: 50, role: 'POR', color: '#405BA4' },
      { x: 20, y: 20, role: 'LD', color: '#42713F' },
      { x: 20, y: 40, role: 'DFC', color: '#42713F' },
      { x: 20, y: 60, role: 'DFC', color: '#42713F' },
      { x: 20, y: 80, role: 'LI', color: '#42713F' },
      { x: 38, y: 35, role: 'MCD', color: '#AEA503' },
      { x: 38, y: 65, role: 'MCD', color: '#AEA503' },
      { x: 55, y: 20, role: 'MPD', color: '#AEA503' },
      { x: 55, y: 50, role: 'MPC', color: '#AEA503' },
      { x: 55, y: 80, role: 'MPI', color: '#AEA503' },
      { x: 75, y: 50, role: 'DC', color: '#91211B' },
    ],
    '3-5-2': [
      { x: 5, y: 50, role: 'POR', color: '#405BA4' },
      { x: 20, y: 30, role: 'DFC', color: '#42713F' },
      { x: 20, y: 50, role: 'DFC', color: '#42713F' },
      { x: 20, y: 70, role: 'DFC', color: '#42713F' },
      { x: 45, y: 10, role: 'CARD', color: '#AEA503' },
      { x: 40, y: 35, role: 'MC', color: '#AEA503' },
      { x: 40, y: 50, role: 'MC', color: '#AEA503' },
      { x: 40, y: 65, role: 'MC', color: '#AEA503' },
      { x: 45, y: 90, role: 'CARI', color: '#AEA503' },
      { x: 70, y: 40, role: 'DC', color: '#91211B' },
      { x: 70, y: 60, role: 'DC', color: '#91211B' },
    ],
    '5-3-2': [
      { x: 5, y: 50, role: 'POR', color: '#405BA4' },
      { x: 20, y: 15, role: 'CARD', color: '#42713F' },
      { x: 22, y: 35, role: 'DFC', color: '#42713F' },
      { x: 22, y: 50, role: 'DFC (LIB)', color: '#42713F' },
      { x: 22, y: 65, role: 'DFC', color: '#42713F' },
      { x: 20, y: 85, role: 'CARI', color: '#42713F' },
      { x: 45, y: 30, role: 'MC', color: '#AEA503' },
      { x: 45, y: 50, role: 'MC', color: '#AEA503' },
      { x: 45, y: 70, role: 'MC', color: '#AEA503' },
      { x: 70, y: 40, role: 'DC', color: '#91211B' },
      { x: 70, y: 60, role: 'DC', color: '#91211B' },
    ],
  };

  constructor() {}

  // Event listener para el select de formación (del HTML original)
  // Este método tiene que estar presente si el (change) event está en el select
  onFormationSelectChange(event: Event): void {
    const selectedFormationKey = (event.target as HTMLSelectElement).value;
    this.updatePlayerPositions(selectedFormationKey);
  }

  // ngAfterViewInit para cargar la formación inicial o manejar el select si se usa ViewChild
  ngAfterViewInit(): void {
    // Conectar el select de formaciones si no se usa (change) en el template
    // o para cargar una formación por defecto
    const selectElement = document.getElementById('Jaime') as HTMLSelectElement;
    if (selectElement) {
      selectElement.addEventListener('change', (event) =>
        this.onFormationSelectChange(event)
      );
      // Para cargar una formación inicial si alguna está seleccionada por defecto (que no sea el placeholder)
      if (
        selectElement.value &&
        selectElement.value !== 'SELECCIONA UNA FORMACIÓN'
      ) {
        this.updatePlayerPositions(selectElement.value);
      }
    } else {
      // Si se usa ViewChild y (change) en el template, este bloque es alternativo
      if (this.formationSelect?.nativeElement) {
        // this.formationSelect.nativeElement.value podría ser la opción "SELECCIONA..."
        // o un valor numérico como "1", "2", etc. Hay que mapear esto.
        // La lógica actual en el HTML usa values como "4-3-3", "4-4-2".
        // El select original en create.component.html tiene values "1", "2", ...
        // Es importante que los values del select coincidan con las keys de formationsData
        // Modificaré el onFormationChange para que use el valor del select.
      }
    }
  }

  // Método modificado para manejar el cambio de formación desde el select original
  // Este método se llamará desde el event listener añadido en ngAfterViewInit
  // O directamente desde el template si se usa (change)="onFormationSelected($event.target.value)"
  updatePlayerPositions(formationKey: string): void {
    // Mapear value "1" a "4-3-3", "2" a "4-4-2", etc. si es necesario
    // O mejor, cambiar los values del select en create.component.html
    // a "4-3-3", "4-4-2" para que coincidan con las keys de formationsData.
    // Asumiré que los values del select ya son "4-3-3", "4-4-2", etc.
    // Si no, necesitas un mapeo aquí.

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
          const playerData: DraggedPlayerData = JSON.parse(playerDataString);
          targetPosition.droppedPlayer = playerData;
          targetPosition.isOccupied = true;
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
