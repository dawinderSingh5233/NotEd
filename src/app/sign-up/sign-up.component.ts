import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { SignupRequest } from '../models/requestModels';
import { environment } from 'src/environments/environment';
import { SignupResponse } from '../models/responseModels';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  isLoading: boolean = false;
  pwdShow: boolean = false;
  confirmPwdShow: boolean = false;
  signUpForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  passwordToggle() {
    this.pwdShow = !this.pwdShow;
  }

  confirmPasswordToggle() {
    this.confirmPwdShow = !this.confirmPwdShow;
  }

  async onSignupBtnClick() {
    if (this.signUpForm.valid) {
      let username = this.signUpForm.get('username')?.value;
      let emailAddress = this.signUpForm.get('emailAddress')?.value;
      let password = this.signUpForm.get('password')?.value;
      let confirmPassword = this.signUpForm.get('confirmPassword')?.value;

      if (password === confirmPassword) {
        this.isLoading = true;
        await this.utils.timeout(2000);

        let body: SignupRequest = {
          email: emailAddress,
          userName: username,
          password: password,
        };

        this.signup(body);
      } else {
        console.log('password and confirm password doesnot match');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  signup(body: SignupRequest) {
    let url = environment.apiUrl + environment.signup;

    this.http.post<SignupResponse>(url, body).subscribe((response) => {
      this.isLoading = false;

      if (response.statusCode === 200) {
        console.log('user created successfully');
        this.router.navigate(['/login']);
      } else {
        console.log('Something went wrong');
      }
    });
  }
}
