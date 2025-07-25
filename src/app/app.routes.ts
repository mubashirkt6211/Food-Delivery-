import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainLayoutAdminComponent } from './owner/main-layout-admin/main-layout-admin.component';

// Guards
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SettingsComponent } from './settings/settings.component';
import { GiftComponent } from './gift/gift.component';
import { FavoriteComponent } from './favorites/favorites.component';
import { AddressComponent } from './address/address.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersuccessComponent } from './ordersuccess/ordersuccess.component';

import { AddRestaurantComponent } from './owner/addrestaurants/addrestaurants.component';
import { OwnerAddDishComponent } from './owner/add-dishes/add-dishes.component';
import { RestaurantDetailsComponent } from './owner/restaurant-details/restaurant-details.component';
import { DashboardComponentAdmin } from './owner/dashboardadmin/dashboard.component';
import { AdminOrdersComponent } from './owner/admin-orders/admin-orders.component';

export const routes: Routes = [
  // 🌐 Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ PUBLIC ROUTES (NO GUARD)
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'redirect', loadComponent: () => import('./redirect/redirect.component').then(m => m.RedirectComponent) },
  { path: 'payment/ordersuccess/:orderId', component: OrdersuccessComponent },
  // { path: 'payment/fail', loadComponent: () => import('./payment/fail/fail.component').then(m => m.FailComponent) }, // optional
  // { path: 'payment/cancel', loadComponent: () => import('./payment/cancel/cancel.component').then(m => m.CancelComponent) }, // optional

  // 👤 USER ROUTES
  {
    path: 'user',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'foods', component: ProductsComponent },
      { path: 'restaurant', component: RestaurantComponent },
      { path: 'restaurant/:id', component: RestaurantComponent },
      { path: 'favorites', component: FavoriteComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'gift', component: GiftComponent },
      { path: 'address/:restaurantId', component: AddressComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },

  // 🍽️ OWNER ROUTES
 {
  path: 'owner',
  component: MainLayoutAdminComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { role: 'OWNER' }, // ✅ Add this line
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponentAdmin },
    { path: 'add', component: AddRestaurantComponent },
    { path: 'my-restaurant', component: RestaurantDetailsComponent },
    { path: 'my-dishes', component: OwnerAddDishComponent },
    { path: 'admin-orders', component: AdminOrdersComponent },
  ],
},


  // ❌ 404 fallback
  { path: '**', redirectTo: 'login' },
];
