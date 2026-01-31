import { Routes } from '@angular/router';
import { LoginComponent } from './components/feature/login/login.component';
import { RecipesComponent } from './components/feature/recipes/recipes';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'recipes', component: RecipesComponent }
];
