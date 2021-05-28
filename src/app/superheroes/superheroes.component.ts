import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/internal/operators';
import {Apollo, gql} from 'apollo-angular';
import {Superhero} from '../superheroes/superhero';
//apollo get query
const GET_SUPERHEROES = gql`
    {
        superheroes {
            id
            __typename
            firstName
            lastName
            superheroName
            dateOfBirth
            superPowers
        }
    }
`;

@Component({
  selector: 'app-superheroes',
  templateUrl: './superheroes.component.html',
  styleUrls: ['./superheroes.component.css']
})

export class SuperheroesComponent implements OnInit, AfterViewInit { 
     @ViewChild("form") private form: ElementRef;
     @ViewChild("closeButton") private closeButton: ElementRef;
     @ViewChild("confirmAddButton") private confirmAddButton: ElementRef;
     @ViewChild("confirmUpdateButton") private confirmUpdateButton: ElementRef;
     //create and update form button switch
     isCreateFormActive: boolean = false;
     isUpdateFormActive: boolean = false; 
     //auxiliary variables       
     updatedSuperhero: Superhero;   
     superheroes: Superhero[];
     //really don't know what's this good for
     private querySubscription: Subscription;
     //apollo
     name: any[];
     loading = true;
     error: any;
     //form
     superheroForm = this.fb.group({
         name: this.fb.group({
             firstName: ['', [
                Validators.required, 
                Validators.minLength(3), 
                Validators.maxLength(10), 
                Validators.pattern(/^[a-zA-Z' ]+$/)]],
             lastName: ['', [
                Validators.required, 
                Validators.minLength(3), 
                Validators.maxLength(10),
                Validators.pattern(/^[a-zA-Z' ]+$/)]],
             superheroName: ['', [
                Validators.required, 
                Validators.minLength(3),
                Validators.maxLength(20),
                Validators.pattern(/^[a-zA-Z' ]+$/)],
                [this.superheroNameValidator()] //my async form
                ],
         }),
         dateOfBirth: ['', [
            Validators.required, 
            Validators.pattern(/^((0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4})$|^(\d{1,5}\sBC)$/)]],
         superPowers: ['', [
            Validators.required, 
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z', ]+$/)]]
     });
  //Async validator superheroNameExists
  checkIfSuperheroNameExists(superheroName: string): Observable<boolean> {
      let superheroNames = [];
      for (let superhero of this.superheroes) {
          superheroNames.push(superhero.superheroName.toLowerCase());
      }
      return of(superheroNames.includes(superheroName.toLowerCase()));
  }
  superheroNameValidator(): AsyncValidatorFn {
        return(control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.checkIfSuperheroNameExists(control.value).pipe(
              map(res => {
                  if (this.isCreateFormActive){
                    return res ? {superheroNameExists: true} : null;
                  }
              })
            );
        }
  }  
       
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private apollo: Apollo
  ) {}
  
  get firstName() {return this.superheroForm.get('name').get('firstName'); }
  get lastName() {return this.superheroForm.get('name').get('lastName'); }
  get dateOfBirth() {return this.superheroForm.get('dateOfBirth'); }
  get superPowers() {return this.superheroForm.get('superPowers'); }
  get superheroName() {return this.superheroForm.get('name').get('superheroName'); }
  
  setFirstName(firstName: string) {this.superheroForm.get('name').get('firstName').setValue(firstName); }
  setLastName(lastName: string) {this.superheroForm.get('name').get('lastName').setValue(lastName); }
  setDateOfBirth(dateOfBirth: string) {this.superheroForm.get('dateOfBirth').setValue(dateOfBirth); }
  setSuperPowers(superPowers: string) {this.superheroForm.get('superPowers').setValue(superPowers); }
  setSuperheroName(superheroName: string) {this.superheroForm.get('name').get('superheroName').setValue(superheroName); }

  ngOnInit() {}
  
  ngAfterViewInit(){
     this.refreshSuperheroes();
     //close btn listener
     this.renderer.listen(this.closeButton.nativeElement, 'click', ()=>{
          this.renderer.setStyle(this.form.nativeElement, 'visibility', 'hidden');
          this.superheroForm.reset();
          this.isCreateFormActive = false;
          this.isUpdateFormActive = false;
     });         
  }
  
  ngOnDestroy() {      
    this.querySubscription.unsubscribe();
  }
  
  onSubmit() {
      //create and update form button switch
      if (this.isCreateFormActive) {
          this.confirmCreateSuperhero();
      };
      if (this.isUpdateFormActive) {
          this.confirmUpdateSuperhero();
      };
  }
  
  createSuperhero() {
      this.isCreateFormActive = true;      
      this.renderer.setStyle(this.form.nativeElement, 'visibility', 'visible');          
      
      this.setFirstName('Kuba');
      this.setLastName('Kubula');
      this.setSuperheroName('Kubulus');
      this.setDateOfBirth('11.12.1986');
      this.setSuperPowers('super coder'); 
                        
  }
   
  confirmCreateSuperhero() {
      this.apollo.mutate({
          mutation: gql` mutation 
                {createSuperhero(
                    firstName: "${this.superheroForm.get('name').get('firstName').value}",
                    lastName: "${this.superheroForm.get('name').get('lastName').value}",
                    superheroName: "${this.superheroForm.get('name').get('superheroName').value}",
                    dateOfBirth: "${this.superheroForm.get('dateOfBirth').value}",
                    superPowers: "${this.superheroForm.get('superPowers').value}"
                    )
                { superheroName, id }
            }`
          }).subscribe((result: any) => {
              console.log(`Superhero ${this.superheroName.value} succsessfully created!`);
              this.refreshSuperheroes();
              this.superheroForm.reset();
              this.isCreateFormActive = false;
              this.renderer.setStyle(this.form.nativeElement, 'visibility', 'hidden');                       
          });                         
  }
  
  updateSuperhero(superhero: Superhero) {
      this.updatedSuperhero = superhero;
      this.isUpdateFormActive = true;
      this.renderer.setStyle(this.form.nativeElement, 'visibility', 'visible');          
      this.setFirstName(superhero.firstName);
      this.setLastName(superhero.lastName);
      this.setSuperheroName(superhero.superheroName);
      this.setDateOfBirth(superhero.dateOfBirth);
      this.setSuperPowers(superhero.superPowers);   
  }
  
  confirmUpdateSuperhero() {
      this.apollo.mutate({
          mutation: gql` mutation
                {updateSuperhero(
                    id: "${this.updatedSuperhero.id}"
                    firstName: "${this.firstName.value}"
                    lastName: "${this.lastName.value}"
                    superheroName: "${this.superheroName.value}"
                    dateOfBirth: "${this.dateOfBirth.value}"
                    superPowers: "${this.superPowers.value}"
                  )
                  {superheroName, id}
                }
                `
      }).subscribe(()=>{
          console.log(`Superhero with id ${this.updatedSuperhero.id} succsessfully updated!`);
          this.refreshSuperheroes();
          this.superheroForm.reset();
          this.isUpdateFormActive = false;
          this.renderer.setStyle(this.form.nativeElement, 'visibility', 'hidden');
      });
  }
  
  deleteSuperhero(id: number){
      if(confirm(`Really delete record with id ${id}?`)) {
      this.apollo.mutate({
          mutation: gql` mutation 
                {deleteSuperhero(
                    id:${id}
                    )
                { superheroName, id }
            }`
          }).subscribe(() => {
              console.log(`Superhero with id ${id} succsessfully deleted!`);
              this.refreshSuperheroes();                       
          });  
      };
  }
  
  refreshSuperheroes() {
      this.apollo.
      query({
        query: GET_SUPERHEROES,
        fetchPolicy: 'network-only'
      })
      .subscribe((result: any) => {
        this.superheroes = result?.data?.superheroes;
        this.loading = result.loading;
        this.error = result.error;
      });              
  };
}
