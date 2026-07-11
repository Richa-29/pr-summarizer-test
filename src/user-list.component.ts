import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  template: `
    <div (click)="loadMore()">Load more</div>
    <img src="/assets/banner.png">
    <ul>
      <li *ngFor="let user of users">
        {{ user.name }}
      </li>
    </ul>
  `,
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Issue 1: subscription never unsubscribed — memory leak
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });

    // Issue 2: interval subscription also never cleaned up
    interval(5000).subscribe(() => {
      this.refreshUsers();
    });
  }

  refreshUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  loadMore() {
    // Issue 3: direct DOM manipulation instead of Renderer2
    document.querySelector('.load-more-btn')!.innerHTML = 'Loading...';
  }
}
