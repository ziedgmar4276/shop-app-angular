import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { StarRatingComponent } from 'ng-starrating';
import { AuthService } from '../services/auth/auth.service';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  products = [];
  imagesURL = environment.imagesLink;


  constructor(private productsService: ProductsService, private authService: AuthService) { }

  ngOnInit() {
    this.productsService.fetchProducts();
    this.productsService.getProducts().subscribe(data => {
    
      this.products = [...data];
    });
  }
  addItemToCart(item) {
    this.productsService.addToCart(item._id);
  }
  itemInCart(item) {
    return this.productsService.findItemInCart(item._id);
  }
  delete(id){
    this.productsService.deleteProduct(id).subscribe(res=>{
      this.products.splice(id, 1);
      const snackbar = document.getElementById('snackbar');
      snackbar.innerHTML = 'Product deleted successfully';
      snackbar.className = 'show';
     
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    });
  }
  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
      console.log(`Old Value:${$event.oldValue}, 
      New Value: ${$event.newValue}, 
      Checked Color: ${$event.starRating.checkedcolor}, 
      Unchecked Color: ${$event.starRating.uncheckedcolor}`);
     
  }
 
}
