import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { SignupRequest } from '../models/requestModels';
import { environment } from 'src/environments/environment';
import { SignupResponse } from '../models/responseModels';
import { ToastService } from '../toast/toast.service';

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
    private utils: UtilsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
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
      let firstName = this.signUpForm.get('firstName')?.value;
      let lastName = this.signUpForm.get('lastName')?.value;
      let emailAddress = this.signUpForm.get('emailAddress')?.value;
      let password = this.signUpForm.get('password')?.value;

      this.isLoading = true;
      await this.utils.timeout(2000);

      let body: SignupRequest = {
        email: emailAddress,
        firstName: firstName,
        lastName: lastName,
        password: password,
      };

      this.signup(body);
    } else {
      this.toastService.createNewToast('Error', 'Invalid Form Data');
    }
  }

  signup(body: SignupRequest) {
    let url = environment.apiUrl + environment.signup;

    this.http.post<SignupResponse>(url, body).subscribe((response) => {
      this.isLoading = false;

      if (response.statusCode === 201) {
        this.toastService.createNewToast(
          'Success',
          'User Created Successfully.'
        );
        this.router.navigate(['/login']);
      } else {
        this.toastService.createNewToast('Error', 'Something went Wrong');
      }
    });
  }
}
