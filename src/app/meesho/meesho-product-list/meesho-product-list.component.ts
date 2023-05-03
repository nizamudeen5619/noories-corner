import { Component, OnInit } from '@angular/core';
import { MeeshoService } from '../meesho.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-meesho-product-list',
  templateUrl: './meesho-product-list.component.html',
  styleUrls: ['./meesho-product-list.component.css']
})
export class MeeshoProductListComponent implements OnInit{

  products:Product[]=[]

  constructor(private meesho:MeeshoService){}

  ngOnInit(): void {
    this.meesho.getProducts().subscribe((products)=>{
      this.products=products
    })
  }
}
