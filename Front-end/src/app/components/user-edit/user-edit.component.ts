import { Component, OnInit } from '@angular/core';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file.upload.service';
import { GLOBAL } from '../../services/global';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from "@angular/common"

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FroalaEditorModule, FroalaViewModule, NgxDropzoneModule, CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  public page_title: string;
  public user: User; // User object
  public status: any;
  public identity: any;
  public token: any;
  public resetVar = true;
  public url: any;
  public uploading = false;

  public namePattern = "^[A-Za-z0-9\\u00C0-\\u017F \\.,!?¡¿;:()'\"_-]+$";
  public emailPattern = "^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$";

  // froala_options
  public froala_options: Object = {
    charCounterCount: false, // Deshabilitado para evitar errores
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // Configuraciones que evitan errores comunes
    specialCharactersSets: [],
    pluginsEnabled: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // Evitar el plugin problemático
    pluginsDisabled: ['specialCharacters', 'emoticons'],
    events: {
      initialized: function () {
        console.log('Froala Editor Initialized Successfully');
      },
      contentChanged: function () {
        // Manejar cambios si es necesario
      }
    }
  };

  // ngx-dropzone options
  files: File[] = [];
  
  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.page_title = 'User Settings';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    // user object
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,'',
      this.identity.description,
      this.identity.image,
    )
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Usar import dinámico con manejo de errores
        import('froala-editor/js/plugins.pkgd.min.js' as any).catch(error => {
          console.warn('Froala plugins could not be loaded:', error);
          // Continuar sin plugins si falla la carga
        });
      } catch (error) {
        console.warn('Error loading Froala plugins:', error);
      }
    }
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onRemoveAll(): void {
    // Limpiar el array de archivos
    this.files = [];
    
    // Si necesitas realizar alguna acción adicional, como limpiar el modelo
    if (this.user && this.user.image) {
      // Opcional: Borrar la referencia a la imagen en el modelo
      // this.user.image = null;
    }
  }

  // creaate a promise with no value 
  uploadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadFile(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.user.image = response.image;
            this.identity.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('identity', JSON.stringify(this.identity));
            // To indicate that the image is uploaded and the uploading is finished
            this.uploading = false;
            // Indicate success of the promise
            resolve();
          } else {
            this.status = 'error';
            this.uploading = false;
            reject('Error uploading image');
          }
        },
        error: (error) => {
          console.log(error);
          this.status = 'error';
          this.uploading = false;
          reject(error);
        }
      });
    });
  }

  // onSubmit method to handle form submission
  // form is the form object that is passed from the template
  // async is used to indicate that this method is asynchronous and will return a promise, so we can use await inside it
  async onSubmit(form: any) {
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      // First, check if the user has selected any files to upload
      if (this.files.length > 0) {
        this.uploading = true;
        // Call the uploadImage method to upload the image
        // and await for it to finish before proceeding
        await this.uploadImage();
      }
      
      // Save the user data
      this.userService.update(this.token, this.user).subscribe({
        next: (response) => {
          if (!response.user) {
            this.status = 'error';
          } else {
            this.status = 'success';
            this.identity = this.user;
            localStorage.setItem('identity', JSON.stringify(this.user));
            // Make a timeout to scroll to the top of the page after 100ms
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Alternative using ViewChild:
              // this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }, 100);
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      this.status = 'error';
      console.log(error);
    }
  }
}