// ORCA Marine Bridge Console — Hash Router
// Manages zero-build client side routing, view mounting, and navigation state

import { renderLandingView } from './views/landing.js';
import { renderFishermanView } from './views/fisherman.js';
import { renderChatView } from './views/chat.js';
import { renderMapView } from './views/map.js';
import { renderSafetyView } from './views/safety.js';
import { renderRouteView } from './views/route.js';
import { renderResearchView } from './views/research.js';
import { renderAdminView } from './views/admin.js';

export class Router {
  constructor(routes, options = {}) {
    this.routes = routes;
    this.options = options;
    this.currentRoute = null;
    this.viewportEl = document.getElementById('app-viewport');
    
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/';
    const cleanRoute = rawHash.replace(/^#/, '').split('?')[0] || '/';
    
    // Match route handler
    const handler = this.routes[cleanRoute] || this.routes['/'] || renderLandingView;
    this.currentRoute = cleanRoute;

    // Update Console Rail Active Highlight
    this.updateActiveRail(cleanRoute);

    // Render View inside viewport
    if (this.viewportEl) {
      this.viewportEl.innerHTML = '';
      handler(this.viewportEl, this.options);
      this.viewportEl.scrollTop = 0;
    }
  }

  updateActiveRail(route) {
    const railItems = document.querySelectorAll('.rail-nav-item');
    railItems.forEach(item => {
      const itemHref = item.getAttribute('href') || '';
      const itemRoute = itemHref.replace(/^#/, '');
      if (itemRoute === route || (route === '/' && itemRoute === '')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  refresh() {
    this.handleRoute();
  }
}
