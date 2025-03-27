import { Component } from '@angular/core';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-user-edit',
  imports: [FroalaEditorModule, FroalaViewModule, NgxDropzoneModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {

}
