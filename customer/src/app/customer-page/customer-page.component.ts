import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantDTO } from '../customer/RestaurantDto'; // Import the model
import { ItemDto } from '../customer/ItemDto';
import { OrderDto } from '../customer/OrderDto';
import { ItemListDto } from '../customer/ItemListDto';
import {CookieService} from 'ngx-cookie-service';
import { ReturnedOrderDto } from '../customer/ReturnedOrder';


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
  private getOrdersForCustomerUrl = 'http://localhost:8030/customer/api/orders';
  public restaurants: RestaurantDTO[] = [];
  public expandedRestaurantId: number | null = null; // Track which restaurant is expanded
  public items: ItemDto[] = []; 
  cart: ItemDto[] = []; // Stores selected items in cart
  public userOrders: ReturnedOrderDto[] = [];
  public showOrders: boolean = false; // Controls order visibility

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
      userId: userId, // Sending userId as a request header
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
    console.log(itemListDto);
    this.order(itemListDto).subscribe({
      next: (data: any) => {
        let returnedOrder: ReturnedOrderDto = data;
        alert(`Good news! Because of your customer rating, the final price of your order was only: `+ returnedOrder.finalPrice);
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      },
    });
  }

  toggleRestaurant(restaurant: RestaurantDTO): void {
    if (this.expandedRestaurantId === restaurant.id) {
      this.expandedRestaurantId = null; // Collapse if already expanded
    } else {
      this.expandedRestaurantId = restaurant.id;
    }
  }

  fetchOrders(): void {
    let token = this.cookieService.get('Token');
    let userId = JSON.parse(atob(token.split('.')[1]))['userId'];
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', userId: userId });

    this.getAllOrdersForCustomer().subscribe({
      next: (orders) => {
        this.userOrders = orders;
        this.showOrders = true;
        console.log('User orders fetched:', orders);
      },
      error: (err) => console.error('Error fetching orders:', err),
    });
  }

  public getAllOrdersForCustomer(): Observable<ReturnedOrderDto[]>{
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
    const url = `${this.getOrdersForCustomerUrl}/${userId}`;
    return this.httpClient.get<ReturnedOrderDto[]>(url);
  }

}
