import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {Apollo, gql} from 'apollo-angular';
import {Superhero} from '../superheroes/superhero';

const CREATE_SUPERHERO = gql`
    mutation CreateSuperhero {
        createSuperhero {
            firstName
            lastName
            dateOfBirth
            superPower
        }
    }
`;

@Component({
  selector: 'app-superheroes',
  templateUrl: './superheroes.component.html',
  styleUrls: ['./superheroes.component.css']
})
export class SuperheroesComponent implements OnInit { 
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
             lastName: ['', [Validators.required, Validators.minLength(3)]]
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
  
  setFirstName(firstName: string) {this.superheroForm.get('name').get('firstName').setValue(firstName); }
  setLastName(lastName: string) {this.superheroForm.get('name').get('lastName').setValue(lastName); }
  setDateOfBirth(dateOfBirth: string) {this.superheroForm.get('dateOfBirth').setValue(dateOfBirth); }
  setSuperPowers(superPowers: string) {this.superheroForm.get('superPowers').setValue(superPowers); }

  ngOnInit() { 
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
                    dateOfBirth: "${this.superheroForm.get('dateOfBirth').value}",
                    superPowers: "${this.superheroForm.get('superPowers').value}"
                    )
                { firstName }
            }`
          }).subscribe(data => {
              console.log(`Entity superhero ${this.superheroForm.get('name').get('firstName').value}
              succsessfully created!`);
          });  
      
      
      /* json-server
      this.api.addAstronaut(astronaut).subscribe(data => {
          console.log(data);         
      });
      */
          
      this.superheroForm.reset(); 
      this.refreshSuperheroes();         
  }
  
  addAddButtonListener() {
      const form = document.getElementById('form');
      const button = document.getElementById('add-button');
      const buttonClose = document.getElementById('close-form');
      const buttonConfirm = document.getElementById('form-submit');
      
      this.renderer.listen(button, 'click', ()=>{
          this.renderer.setStyle(form, 'visibility', 'visible');          
          this.renderer.setStyle(buttonConfirm, 'visibility', 'visible');
          this.superheroForm.reset();
      });
      this.renderer.listen(buttonConfirm, 'click', ()=>{
          this.renderer.setStyle(form, 'visibility', 'hidden');
          this.renderer.setStyle(buttonConfirm, 'visibility', 'hidden');
      });
      this.renderer.listen(buttonClose, 'click', ()=>{
          this.renderer.setStyle(form, 'visibility', 'hidden');
          this.renderer.setStyle(buttonConfirm, 'visibility', 'hidden');
          this.superheroForm.reset();
      });
  }
  
  //error
  addButtonUpdateListener() {
      
  }
  
  refreshSuperheroes() {
      this.apollo
      .watchQuery({
        query: gql`
          {
            superheroes {
              id
              firstName
              lastName
              superheroName
              dateOfBirth
              superPowers
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.superheroes = result?.data?.superheroes;
        this.loading = result.loading;
        this.error = result.error;
      });
      
      
  };
  
  deleteAstronaut(id: number){
         
  };
}
