import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IsAutenticatedResponse } from './models/responseModels';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit() {}

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
}
