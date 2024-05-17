import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public form = this.fb.group({
    region : ['', Validators.required],
    country: ['', Validators.required],
    border : ['', Validators.required],

  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  public get regions(): Region[] {
    return this.countriesService.regions;
  }

  public onRegionChanged(): void {
    this.form.get('region')?.valueChanges
      .pipe(
        tap( () => this.form.get('country')?.reset('') ),
        switchMap( region => this.countriesService.getCountriesByRegion(region as Region) )
      )
      .subscribe(countries=> {
        this.countriesByRegion = countries;
      });
  }

  public onCountryChanged(): void {
    this.form.get('country')!.valueChanges
    .pipe(
      tap( () => this.form.get('border')!.reset('') ),
      filter( (value: string | null) => value !== null && value.length > 0 ),
      switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode!) ),
      switchMap( (country) => this.countriesService.getCountryBordersByCodes( country.borders ) ),
    )
    .subscribe( countries => {
      this.borders = countries;
    });
  }


}
