import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListingOrderReqDto, ListingOrderResDto } from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/listing')
  async listing(@Body() req: ListingOrderReqDto): Promise<ListingOrderResDto> {
    return await this.orderService.listing(req);
  }
}
