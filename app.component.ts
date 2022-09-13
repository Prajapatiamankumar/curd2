import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms'
import { Action } from './helpers/action.enum';
import { MustMatch } from './helpers/must-match-validator';
import { UserApi } from './helpers/user-api.service';
import { User } from './helpers/user.interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'User Registration';
  addForm: FormGroup;
  submitted: boolean = false;
  buttonText: string = "";
  formTitle: string = "";
  dbops: Action;
  @ViewChild('content') elContant: any;
  modelRef: any;

  userData: User[] = [];

  constructor(private _toastr: ToastrService, private modalService: NgbModal, private _userApi: UserApi) { }

  ngOnInit() {
    this.setFormState();
    this.getAllUsers();
  }
  setFormState() {
    this.buttonText = "Save";
    this.formTitle = "Add User";
    this.dbops = Action.create;

    this.addForm = new FormGroup({
      id: new FormControl(0),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.compose([Validators.required])),
      lastName: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      dob: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required])),
      acceptTerms: new FormControl(false, Validators.requiredTrue),
    },
      MustMatch('password', 'confirmPassword'));
  }
  get ctrl() {
    return this.addForm.controls
  }
  //add user form control 
  addUser() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }
    switch (this.dbops) {
      case Action.create:
   //code here to save data for database
        this._userApi.addUser(this.addForm.value).subscribe(res => {
          this._toastr.success("User added !!", "User Registration");
          this.getAllUsers();
          this.cancelForm();
        });

        break;
      case Action.update:
   //code here to update data for database
        this._userApi.updateUser(this.addForm.value).subscribe(res => {
          this._toastr.success("User updated !!", "User Registration")
          this.getAllUsers();
          this.cancelForm();
        });

        break;
    }

  }

  //cancel button code
  cancelForm() {
    this.buttonText = "Save";
    this.formTitle = "Add User";
    this.dbops = Action.create;
    this.submitted = false;

    this.addForm.reset({
      id: 0,
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    });
    this.modelRef.close();

  }
  getAllUsers() {
    this._userApi.getUsers().subscribe((res: User[]) => {
      this.userData = res;
  
    });
  }
  openXl(content: any) {
    this.modelRef = this.modalService.open(content, { size: 'xl' });
  }
  //update   button 
  edit(userId: number) {
    this.buttonText = "Update";
    this.formTitle = "Update User";
    this.dbops = Action.update;

    let user = this.userData.find((u: User) => u.id === userId)
    this.addForm.patchValue(user);
    this.addForm.get('password').setValue('');
    this.addForm.get('confirmPassword').setValue('');
    this.addForm.get('accpetTerms').setValue(false);

    this.modelRef = this.modalService.open(this.elContant, { size: 'xl' });
  }
  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, Keep it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // here code for delete
        this._userApi.deleteUser(id).subscribe(res => {
          this.getAllUsers();
          Swal.fire(
            'Deleted!',
            'User data has been deleted.',
            'success'
          )
        })

      }
      else {
        Swal.fire(
          'Cancel!',
          'Your file has been saved.',
          'error'
        )
      }

    })

  }
}
