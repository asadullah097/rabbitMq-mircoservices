import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Order } from "./schemas/order.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
    protected readonly logger = new Logger(Order.name)

    constructor(
        @InjectModel(Order.name) OrderModule: Model<Order>,
        @InjectConnection() connection: Connection
    ) {
        super(OrderModule, connection)
    }
}