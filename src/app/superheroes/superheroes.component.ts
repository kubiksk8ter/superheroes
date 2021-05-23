import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {Apollo, gql} from 'apollo-angular';
import {Superhero} from '../superheroes/superhero';

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
     @ViewChild("addButton") addButton: ElementRef;
     @ViewChild("form") form: ElementRef;
     @ViewChild("closeButton") closeButton: ElementRef;
     @ViewChild("confirmButton") confirmButton: ElementRef;
    
     superheroes: Superhero[];
     private querySubscription: Subscription;
     //apollo
     name: any[];
     loading = true;
     error: any;
     //form
     superheroForm = this.fb.group({
         name: this.fb.group({
             firstName: ['', [Validators.required, Validators.minLength(3)]],
             lastName: ['', [Validators.required, Validators.minLength(3)]],
             superheroName: ['', [Validators.required, Validators.minLength(3)]]
         }),
         dateOfBirth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4}$/)]],
         superPowers: ['', [Validators.required, Validators.minLength(3)]]
     });

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

  ngOnInit() { 
        
  }
  ngAfterViewInit(){
     this.refreshSuperheroes();         
     this.addAddButtonListener();
  }
  
  ngOnDestroy() {      
    this.querySubscription.unsubscribe();
  }
  
  onSubmit() {
      /*
      astronaut.firstName = this.astronautForm.get('name').get('firstName').value;
      astronaut.lastName = this.astronautForm.get('name').get('lastName').value;
      astronaut.dateOfBirth = this.astronautForm.get('dateOfBirth').value;
      astronaut.superAbility = this.astronautForm.get('superAbility').value;
      */
      this.apollo.mutate({
          mutation: gql` mutation 
                {createSuperhero(
                    firstName: "${this.superheroForm.get('name').get('firstName').value}",
                    lastName: "${this.superheroForm.get('name').get('lastName').value}",
                    superheroName: "${this.superheroForm.get('name').get('superheroName').value}",
                    dateOfBirth: "${this.superheroForm.get('dateOfBirth').value}",
                    superPowers: "${this.superheroForm.get('superPowers').value}"
                    )
                { superheroName }
            }`
          }).subscribe((result: any) => {
              console.log(`Superhero succsessfully created!`);
              this.refreshSuperheroes();
              this.superheroForm.reset();                       
          });  
      
      
      /* json-server
      this.api.addAstronaut(astronaut).subscribe(data => {
          console.log(data);         
      });
      */                  
  }
  
  addAddButtonListener() {      
      this.renderer.listen(this.addButton.nativeElement, 'click', ()=>{
          this.renderer.setStyle(this.form.nativeElement, 'visibility', 'visible');          
          this.renderer.setStyle(this.confirmButton.nativeElement, 'visibility', 'visible');
            this.setFirstName('Kuba');
            this.setLastName('Kubula');
            this.setSuperheroName('Kubulus');
            this.setDateOfBirth('11.12.1986');
            this.setSuperPowers('super coder');
      });
      this.renderer.listen(this.confirmButton.nativeElement, 'click', ()=>{
          this.renderer.setStyle(this.form.nativeElement, 'visibility', 'hidden');
          this.renderer.setStyle(this.confirmButton.nativeElement, 'visibility', 'hidden');
      });
      this.renderer.listen(this.closeButton.nativeElement, 'click', ()=>{
          this.renderer.setStyle(this.form.nativeElement, 'visibility', 'hidden');
          this.renderer.setStyle(this.confirmButton.nativeElement, 'visibility', 'hidden');
          this.superheroForm.reset();
      });             
  }
  
  //error
  addButtonUpdateListener() {
      
  }
  
  refreshSuperheroes() {
      this.apollo
      .query({
        query: GET_SUPERHEROES,
        fetchPolicy: 'network-only'
      })
      .subscribe((result: any) => {
        this.superheroes = result?.data?.superheroes;
        this.loading = result.loading;
        this.error = result.error;
      });              
  };
  
  deleteSuperhero(id: number){
      if(confirm(`Really delete record with id ${id}?`)) {
      this.apollo.mutate({
          mutation: gql` mutation 
                {deleteSuperhero(
                    id:${id}
                    )
                { superheroName }
            }`
          }).subscribe(() => {
              console.log(`Superhero with id ${id} succsessfully deleted!`);
              this.refreshSuperheroes();                       
          });  
      };
  }
}
