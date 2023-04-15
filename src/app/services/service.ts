import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private _http: HttpClient) {}

  products$ = (category: string) =>
    of([{ id: 1, name: 'Product', price: 123 }]).pipe(delay(500));
}

interface Product {
  id: string;
  name: string;
  price: number;
}
