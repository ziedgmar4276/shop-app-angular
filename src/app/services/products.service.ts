import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
 url="http://localhost:3000/api";
  _products = [];
  _cart = [];
  productsSub;
  cartSub;
  constructor(private http: HttpClient) {
    this.productsSub = new BehaviorSubject<any[]>(this._products);
    this.cartSub = new BehaviorSubject<any[]>(this._cart);
  }

  fetchProducts()  {
    this.http
      .get<any[]>(`${this.url}/products`, {
        headers: { "Content-Type": "application/json" }
      })
      .subscribe(data => {
        this._products = [...data];
        this.productsSub.next([...this._products]);
      });
  }
  

  deleteProduct(id) {
    return this.http.delete(`${this.url}/product/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
  }
  getProducts() {
    return this.productsSub.asObservable();
  }
  editProduct(id) {
    return this.http.get(`${this.url}/product/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
  }
  updateProduct(id, data) {
    return this.http.put(`${this.url}/product/${id}`, data, {
      headers: { "Content-Type": "application/json" }
    });
  }
  deleteOrder(id) {
    return this.http.delete(`${this.url}/order/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
  }
  getCart() {
    return this.cartSub.asObservable();
  }
  addToCart(id) {
    const product = this.findItemInProducts(id);
    if (product.length !== 0) {
      if (this.findItemInCart(id).length) {
        this.removeFromCart(id);
      } else {
        this._cart.push(product[0]);
        localStorage.setItem("product",JSON.stringify(product));
      
      }
      this.cartSub.next([...this._cart]);
    }
  }
  
  removeFromCart(id) {
    if (this.findItemInCart(id).length) {
      const item = this.findItemInCart(id)[0];
      const index = this._cart.indexOf(item);
      this._cart.splice(index, 1);
    }
    this.cartSub.next([...this._cart]);
  }
   
  
  clearCart() {
    this.cartSub.next([]);
  }

  findItemInCart(id) {
    const item = this._cart.filter(product => product._id === id);
    return item;
  }
  findItemInProducts(id) {
    const item = this._products.filter(product => product._id === id);
    return item;
  }
  checkout(data) {
    return this.http.post(`${this.url}/checkout`, data, {
      headers: { "Content-Type": "application/json" }
    });
  }
}
