import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './http.interceptor';
import { AuthGuard } from './auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';
import { TreeComponent } from './tree/tree.component';
import { BranchComponent } from './tree/branch/branch.component';
import { PageComponent } from './tree/branch/page/page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    ToastComponent,
    TreeComponent,
    BranchComponent,
    PageComponent,
    SidebarComponent,
    EditorComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
function provideHttpClient(): import('@angular/core').Provider {
  throw new Error('Function not implemented.');
}
