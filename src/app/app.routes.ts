import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecipesComponent } from './components/recipes/recipes';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'recipes', component: RecipesComponent }
];
