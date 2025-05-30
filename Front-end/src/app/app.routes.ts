import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { CourseNewComponent } from './components/course-new/course-new.component';
import { CourseEditComponent } from './components/course-edit/course-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { CartComponent } from './components/cart/cart.component';
import { VideoNewComponent } from './components/video-new/video-new.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { VideoEditComponent } from './components/video-edit/video-edit.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'logout/:sure',
        component: LoginComponent
    },
    {
        path: 'settings',
        component: UserEditComponent
    },
    {
        path: 'create-course',
        component: CourseNewComponent
    },
    {
        path: 'course-edit/:id',
        component: CourseEditComponent
    },
    {
        path: 'categories',
        component: CategoryListComponent
    },
    {
        path: 'create-category',
        component: CategoryNewComponent
    },
    {
        path: 'category-edit/:id',
        component: CategoryEditComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'create-video/:id',
        component: VideoNewComponent
    },
    {
        path: 'course/:id',
        component: CourseDetailComponent
    },
    {
        path: 'video-edit/:id',
        component: VideoEditComponent
    },
    {
        path: 'video-detail/:id',
        component: VideoDetailComponent
    }
];
