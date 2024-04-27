import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { OpenApiResp, PageRes } from 'src/core/response.dto';
import { CollectionService } from './collection.service';
import {
  CollectionPageReqDto,
  CollectionPageResItemDto,
} from './dto/collection.dto';

@Public()
@ApiTags('Collection')
@Controller('/api/v1/collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Page collection' })
  @Get('/page')
  @HttpCode(200)
  @OpenApiResp(CollectionPageResItemDto, true)
  async page(
    @Query() req: CollectionPageReqDto,
  ): Promise<PageRes<CollectionPageResItemDto>> {
    return await this.collectionService.page(req);
  }
}
