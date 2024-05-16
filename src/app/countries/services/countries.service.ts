import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Region, SmallCountry } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [ ...this._regions ];
  }

  public getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region)
      return of([]);

    const url: string = `${this.baseUrl}/region/${region}/?fields=name,cca3,borders`;

    return this.http.get<SmallCountry[]>(url)
      .pipe(
        tap( response => console.log(response) )
      );
  }

}