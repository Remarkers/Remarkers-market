import { ApiProperty } from '@nestjs/swagger';
import { PageReq } from 'src/core/response.dto';

export enum SortBy {
  VOLUME_LOW_TO_HIGH = 'volume_low_to_high',
  VOLUME_HIGHT_TO_LOW = 'volume_hight_to_low',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  RECENTLY_CREATED = 'recently_created',
}

export class CollectionPageReqDto extends PageReq {
  /**
   * Account address
   */
  @ApiProperty({ title: 'Account address', required: false })
  address?: string;
  /**
   * Collection name filter, support fuzzy search
   */
  @ApiProperty({
    title: 'Collection name filter',
    description: 'Support fuzzy search',
    required: false,
  })
  name?: string;
  /**
   * Sort type
   */
  @ApiProperty({ title: 'Sort type', required: false, enum: SortBy })
  sortBy?: SortBy;
}
export class CollectionPageResItemDto {
  /**
   * Collection id
   */
  @ApiProperty({ title: 'Order id' })
  id: string;
  /**
   * Collection name
   */
  @ApiProperty({ title: 'Collection name' })
  name: string;
  /**
   * Collection image
   */
  @ApiProperty({ title: 'Collection image' })
  image: string;
  /**
   * Floor price
   */
  @ApiProperty({ title: 'Floor price' })
  floorPrice: string;
}
