import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantDTO } from '../customer/RestaurantDto'; // Import the model
import { ItemDto } from '../customer/ItemDto';
import { OrderDto } from '../customer/OrderDto';
import { ItemListDto } from '../customer/ItemListDto';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-customer-page',
  standalone: false,
  
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css'
})
export class CustomerPageComponent {
  private baseUrl = 'http://localhost:8030/restaurant/api';
  private getAllRestaurantsURL= this.baseUrl + '/restaurants';
  private getAllItemsURL = 'http://localhost:8030/restaurant/api/item/restaurant';
  private orderURL = 'http://localhost:8030/customer/api/order';
  public restaurants: RestaurantDTO[] = [];
  public items: ItemDto[] = []; 
  cart: ItemDto[] = []; // Stores selected items in cart

  constructor(private httpClient: HttpClient, private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    console.log("executing this now");
    this.fetchAllRestaurants();
    this.fetchAllItems();
  }

  private fetchAllItems(): void {
    for (const r of this.restaurants) {
      this.fetchItemsForRestaurant(r.id);
    }
  }

  private fetchItemsForRestaurant(restaurantId: number): void {
    const url = `${this.getAllItemsURL}/${restaurantId}`; // Properly construct the URL
  
    this.httpClient.get<ItemDto[]>(url).subscribe({
      next: (data: ItemDto[]) => {
        console.log('Items fetched successfully:', data); // Log fetched items
        this.items.push(...data);
      },
      error: (err) => {
        console.error('Error fetching items for restaurant:', err);
      },
    });
  }
  

  private fetchAllRestaurants(): void {
    this.getAllRestaurants().subscribe({
      next: (data: any) => {
        this.restaurants = data; // Store the response in the local array
        console.log('Restaurants fetched successfully:', this.restaurants);
        for (const r of this.restaurants) {
          this.fetchItemsForRestaurant(r.id);
        }
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      },
    });
  }

  public getAllRestaurants(): Observable<RestaurantDTO[]> {
    return this.httpClient.get<RestaurantDTO[]>(this.getAllRestaurantsURL);
  }

  public getAllItems(url: string): Observable<ItemDto[]>{
    return this.httpClient.get<ItemDto[]>(url);
  }

   public parseJwt(token: string): any {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    const decoded: string = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
  
    console.log(JSON.parse(decoded));
  }

  public order(itemListDto: ItemListDto): Observable<OrderDto>{
    let token = this.cookieService.get('Token');
    console.log(token);
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    const decoded: string = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    
    let tokenMap = JSON.parse(decoded);
    console.log(tokenMap);
    let userId = tokenMap['userId'];
    console.log(userId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      userId: userId.toString(), // Sending userId as a request header
    });

    return this.httpClient.post<OrderDto>(this.orderURL, itemListDto, { headers });
  }

  addToCart(item: ItemDto): void {
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    this.cart.push({ ...item });

    // if (existingItem) {
    //   existingItem.quantity! += 1;
    // } else {
    //   
    // }
  }

  /**
   * Removes an item from the cart or decreases quantity
   */
  removeFromCart(item: ItemDto): void {
    const index = this.cart.findIndex(cartItem => cartItem.id === item.id);

    // if (index > -1) {
    //   if (this.cart[index].quantity! > 1) {
    //     this.cart[index].quantity!--;
    //   } else {
        this.cart.splice(index, 1);
      //}
    //}
  }

  /**
   * Calculates total price of items in the cart
   */
  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  placeOrder(): void {
    console.log('Order placed!', this.cart);
    alert(`Order placed successfully! Total: $${this.getTotalPrice()}`);
    let itemList: number[] = [];
    for (const r of this.cart) {
      itemList.push(r.id);
    }
    let itemListDto: ItemListDto = { itemIds: [] }; // Initialize it properly
    itemListDto.itemIds = itemList; // Now you can assign values

    this.cart = []; // Clear cart after order
    this.order(itemListDto).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      },
    });
  }

}
