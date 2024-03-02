import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [Document],
})
export class MainComponent implements OnInit {
  constructor(private accountService: AccountService, private titleService: Title, private router: Router, protected document: Document) {}

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }
  openSideBar(): any {
    document.getElementById('main')!.style.marginLeft = '250px';
  }
  closeSideBar(): any {
    document.getElementById('main')!.style.marginLeft = '50px';
  }
  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }
  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'DOI TRA NEW';
    }
    this.titleService.setTitle(pageTitle);
  }
}
