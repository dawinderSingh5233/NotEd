import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IsAutenticatedResponse } from './models/responseModels';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';
import { ToastService, ToastData } from './toast/toast.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('toastStates', [
      state(
        'open',
        style({
          visibility: 'visible',
        })
      ),
      state(
        'close',
        style({
          visibility: 'hidden',
        })
      ),
      transition(
        'open => close',
        animate(
          150,
          style({
            transform: 'scale(0.25)',
            transition: 'all 150ms ease-in-out',
          })
        )
      ),
    ]),
  ],
})
export class AppComponent implements AfterViewInit {
  isLoading: boolean = true;
  toastData: ToastData = {
    status: 'Success',
    message: 'Testing the toast component',
  };
  showToast: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utils: UtilsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.toastService.getToast().subscribe((newToastData: ToastData) => {
      this.toastData = newToastData;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    });
  }

  ngAfterViewInit(): void {
    (async () => {
      await this.utils.timeout(2000);
      let url = environment.apiUrl + environment.isAuthenticated;
      this.http.get<IsAutenticatedResponse>(url).subscribe((response) => {
        this.isLoading = false;
        if (response.statusCode === 200 && response.authenticated === true) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      });
    })();
  }

  hideToast() {
    this.showToast = false;
  }
}
