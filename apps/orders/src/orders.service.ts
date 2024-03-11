import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrderRepository } from './order.repository';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(BILLING_SERVICE)
    private billingClient: ClientProxy
  ) { }

  async createOrder(request: CreateOrderRequest) {
    const session = await this.orderRepository.startTransaction()
    try {
      const order = await this.orderRepository.create(request, { session })
      await lastValueFrom(this.billingClient.emit('order_created', {
        order
      }))
      await session.commitTransaction()
      return order
    } catch (error) {
      await session.abortTransaction()
      throw error
    }
  }

  async getOrders() {
    return this.orderRepository.find({})
  }
}
