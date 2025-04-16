import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  isExpanded = false;
  isMobile = false;

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
