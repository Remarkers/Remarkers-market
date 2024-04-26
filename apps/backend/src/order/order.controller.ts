import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { Request } from 'express';
import { ListingOrderReqDto, ListingOrderResDto } from './dto/order.dto';
import { OrderService } from './order.service';
import Resp, { RespBuilder } from 'src/core/response.dto';

@ApiTags('Order')
@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Listing order' })
  @Post('/listing')
  @HttpCode(200)
  @ApiOkResponse({ status: 200, type: Resp })
  async listing(
    @Req() request: Request,
    @Body() req: ListingOrderReqDto,
  ): Promise<ListingOrderResDto> {
    return await this.orderService.listing(request['user'], req);
  }
}
