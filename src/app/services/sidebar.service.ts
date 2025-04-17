import {Inject, Injectable, PLATFORM_ID} from "@angular/core"
import {isPlatformBrowser} from "@angular/common"

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  isExpanded = false;
  isMobile = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Solo ejecutar código relacionado con window en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener("resize", () => this.checkScreenSize());
    }
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.isMobile = width < 768;

      if (this.isMobile) {
        this.isExpanded = false;
      } else {
        this.isExpanded = false;
      }
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  open() {
    this.isExpanded = true;
  }

  close() {
    this.isExpanded = false;
  }

  get expanded() {
    return this.isExpanded;
  }

  get mobile() {
    return this.isMobile;
  }
}
