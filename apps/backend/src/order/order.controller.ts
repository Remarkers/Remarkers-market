import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OpenApiResp } from 'src/core/response.dto';
import {
  CancelOrderReqDto,
  CancelOrderResDto,
  ListingOrderReqDto,
  ListingOrderResDto,
} from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Listing order' })
  @Post('/listing')
  @HttpCode(200)
  @OpenApiResp(ListingOrderResDto)
  async listing(
    @Req() request: Request,
    @Body() req: ListingOrderReqDto,
  ): Promise<ListingOrderResDto> {
    return await this.orderService.listing(request['user'], req);
  }

  @ApiOperation({ summary: 'Cancel order' })
  @Post('/cancel')
  @HttpCode(200)
  @OpenApiResp(CancelOrderResDto)
  async cancel(
    @Req() request: Request,
    @Body() req: CancelOrderReqDto,
  ): Promise<CancelOrderResDto> {
    return await this.orderService.cancel(request['user'], req);
  }
}
