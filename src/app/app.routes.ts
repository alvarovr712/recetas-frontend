import { Routes } from '@angular/router';
import { LoginComponent } from './components/feature/login/login.component';
import { RecipesComponent } from './components/feature/recipes/recipes';
import { DashboardComponent } from './components/feature/dashboard/dashboard.component';
import { MyRecipes } from './components/feature/my-recipes/my-recipes';
import { Favorites } from './components/feature/favorites/favorites';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'my-recipes', component: MyRecipes },
    { path: 'favorites', component: Favorites },
    { path: 'admin/dashboard', component: DashboardComponent }
];
