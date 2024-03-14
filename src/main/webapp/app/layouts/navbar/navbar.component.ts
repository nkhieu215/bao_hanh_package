import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  showLogo = 'false';

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private mainComponent: MainComponent
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.toggleSidebar2();
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.loginService.login();
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleSidebar(): void {
    const isSidebarCollapsed = sessionStorage.getItem('toggleSidebar');
    this.showLogo = sessionStorage.getItem('showLogo')!;
    if (isSidebarCollapsed === 'open') {
      this.mainComponent.closeNav();
      document.getElementById('sidebar-id')!.style.width = '50px';
      sessionStorage.setItem('showLogo', 'hide');
      sessionStorage.setItem('toggleSidebar', 'close');
    }
    if (isSidebarCollapsed === 'close') {
      this.mainComponent.openNav();
      document.getElementById('sidebar-id')!.style.width = '250px';
      sessionStorage.setItem('showLogo', 'show');
      sessionStorage.setItem('toggleSidebar', 'open');
    }
  }

  toggleSidebar2(): void {
    this.showLogo = 'hide';
    document.getElementById('sidebar-id')!.style.width = '50px';
    this.mainComponent.closeNav2();
    sessionStorage.setItem('toggleSidebar', 'close');
    sessionStorage.setItem('showLogo', 'show');
  }
}
