export interface DailyActivityDTO {
  fecha: string;   // ISO date string
  valor: number;
}

export interface ActiveUserDTO {
  userId: string;
  name: string;
  surname: string;
  recetasCreadas: number;
  imageUrl: string;
}

export interface DashboardDTO {
  totalUsuarios: number;
  usuariosCrecimiento: number;

  totalRecetas: number;
  recetasCrecimiento: number;

  totalSesiones: number;
  sesionesCrecimiento: number;

  actividadDiaria: DailyActivityDTO[];
  usuariosMasActivos: ActiveUserDTO[];
}
