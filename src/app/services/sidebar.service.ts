import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  isExpanded = true

  constructor() {
    this.checkScreenSize()

    window.addEventListener("resize", () => this.checkScreenSize())
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isExpanded = false
    } else {
      this.isExpanded = true
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded
  }

  open() {
    this.isExpanded = true
  }

  close() {
    this.isExpanded = false
  }
}
