import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingComponent } from './components/landing/landing.component';
import { RegUserComponent } from './components/reg-user/reg-user.component';
import { RegSpecialistComponent } from './components/reg-specialist/reg-specialist.component';
import { CalenderComponent } from './components/calender/calender.component';
import { WildCardComponent } from './components/wild-card/wild-card.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';
import { OtpComponent } from './components/otp/otp.component';
import { SpecialistDetailsComponent } from './components/specialist-details/specialist-details.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { RatingComponent } from './components/rating/rating.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { JoinAsComponent } from './components/join-as/join-as.component';
import { CustDashboardComponent } from './components/cust-dashboard/cust-dashboard.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CreateSectorComponent } from './components/create-sector/create-sector.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { SpecialistsProfileComponent } from './components/specialists-profile/specialists-profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { CreateGigComponent } from './components/create-gig/create-gig.component';
import { SpecialistPageComponent } from './components/specialist-page/specialist-page.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ReviewComponent } from './components/review/review.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reg-user', component: RegUserComponent },
    { path: 'reg-specialist', component: RegSpecialistComponent },
    { path: 'login', component: LoginComponent },
    { path: 'orders/:gigID', component: OrdersComponent },
{path:'review', component:ReviewComponent},
    // {path:'orderPage', component:OrdersComponent},
    { path: 'calender', component: CalenderComponent },
    { path: 'forgot', component: ForgotPwdComponent },
    { path: 'otp', component: OtpComponent },
    {path:'spec-page/:id', component:SpecialistPageComponent},
    { path: 'spec-profile', component: SpecialistsProfileComponent },
    { path: 'spec-detail/:id', component: SpecialistDetailsComponent },
    {path:'gig-create', component: CreateGigComponent},
    // { path: 'cust-detail', component: CustomerDetailsComponent },
    { path: 'cust-detail/:id', component: CustomerDetailsComponent },
    { path: 'rating', component: RatingComponent },
    { path: 'role', component: JoinAsComponent },
    { path: 'cust-dashboard', component: CustDashboardComponent },
    { path: 'cust-page', component: CustomerPageComponent },
    { path: 'message/:chatId', component: MessagesComponent },
    {
        path: 'admin', component: AdminPageComponent,
        children: [
            { path: 'create-ind', component: CreateCategoryComponent },
            { path: 'create-sector', component: CreateSectorComponent },
            { path: 'all-users', component: AllUsersComponent },
        ]
    },

    { path: '**', component: WildCardComponent }
];
