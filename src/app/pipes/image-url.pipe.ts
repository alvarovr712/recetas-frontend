import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // 1. Si es una imagen local (base64/data URL), devolverla tal cual
    if (value.startsWith('data:')) {
      return value;
    }

    // 2. Corregir URLs de Cloudinary malformadas (ej: https// en lugar de https://)
    if (value.includes('res.cloudinary.com')) {
      if (value.startsWith('http') && !value.startsWith('http:')) {
        // Caso: "https//res.cloudinary.com..." -> añadir los dos puntos
        value = value.replace('https//', 'https://').replace('http//', 'http://');
      }
      return value;
    }

    // 3. Si ya es una URL absoluta (empieza por http o https), devolverla tal cual
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // 3. Si es una ruta relativa (empieza por /ImageRecipes o similar)
    if (value.startsWith('/')) {
      return `${environment.apiUrl}${value}`;
    }

    // 4. Por defecto, si no es absoluta, asumimos que cuelga de la API
    return `${environment.apiUrl}/${value}`;
  }
}
