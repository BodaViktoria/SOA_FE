export interface ReturnedOrderDto {
    orderId: number,
    restaurantId: number,
    customerId: number,
    itemIds: number[],
    finalPrice: number
  }
  