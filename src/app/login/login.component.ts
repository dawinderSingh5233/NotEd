import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../models/responseModels';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  pwdShow: boolean = false;
  isLoading: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  passwordToggle() {
    this.pwdShow = !this.pwdShow;
  }

  async onLoginBtnClick() {
    if (this.loginForm.valid) {
      let username: string = this.loginForm.get('username')?.value;
      let password: string = this.loginForm.get('password')?.value;

      this.isLoading = true;
      await this.utils.timeout(2000);
      this.login(username, password);
    } else {
      console.log('Form is invaild');
    }
  }

  login(username: string, password: string) {
    let url = environment.apiUrl + environment.login;
    let body = {
      email: username,
      password: password,
    };

    this.http.post<LoginResponse>(url, body).subscribe((response) => {
      this.isLoading = false;

      if (response.statusCode === 200) {
        if (response.token) {
          localStorage.setItem('authorization-token', response.token);
        }
        this.router.navigate(['home']);
      } else {
        console.log('Invalid username/password');
      }
    });
  }
}
