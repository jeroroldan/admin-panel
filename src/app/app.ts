// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Debug Panel - Solo en desarrollo -->
    <div *ngIf="showDebug" class="fixed top-0 right-0 z-50 bg-red-100 p-2 text-xs border rounded shadow">
      <div>🔧 Debug Mode</div>
      <button (click)="clearAuth()" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Clear Auth</button>
      <button (click)="showState()" class="bg-blue-500 text-white px-2 py-1 rounded text-xs ml-1">Show State</button>
      <button (click)="toggleDebug()" class="bg-gray-500 text-white px-2 py-1 rounded text-xs ml-1">Hide</button>
    </div>

    <!-- Botón para mostrar debug -->
    <button *ngIf="!showDebug"
            (click)="toggleDebug()"
            class="fixed top-2 right-2 z-40 bg-orange-500 text-white w-8 h-8 rounded-full text-xs">
      🔧
    </button>

    <!-- Router Outlet - Aquí se cargan los componentes según las rutas -->
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'Admin Panel Modernizado';
  showDebug = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  clearAuth() {
    // this.authService.clearAllAuthData();
    window.location.href = '/login';
  }

  showState() {
    // this.authService.showCurrentState();
  }

  toggleDebug() {
    this.showDebug = !this.showDebug;
  }
}
