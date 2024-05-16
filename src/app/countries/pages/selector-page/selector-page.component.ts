import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public form = this.fb.group({
    region:  ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],

  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
  }

  public get regions(): Region[] {
    return this.countriesService.regions;
  }

  public onRegionChange(): void {
    this.form.get('region')?.valueChanges
      .pipe(
        switchMap( region => this.countriesService.getCountriesByRegion(region as Region) )
      )
      .subscribe(region => {
        console.log(region);
      });

  }
}
