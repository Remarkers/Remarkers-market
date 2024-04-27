import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export default class Resp<T> {
  @ApiProperty({ title: 'Response code, 200 is success' })
  code: number;
  @ApiProperty({ title: 'Response data' })
  data?: T;
  @ApiProperty({ title: 'Response message' })
  message?: string;
}

export class PageRes<T> {
  @ApiProperty({ title: 'Response data' })
  items: T[];
  @ApiProperty({ title: 'Total count' })
  total: number;
  @ApiProperty({ title: 'Prev cursor' })
  prev?: string;
  @ApiProperty({ title: 'Next cursor' })
  next?: string;
}

export class PageReq {
  @ApiProperty({ title: 'Page size', example: 10 })
  size: number;
  @ApiProperty({ title: 'Cursor', required: false })
  cursor?: string;
}

export const RespBuilder = {
  ok<T>(data: T): Resp<T> {
    return {
      code: 200,
      data,
    };
  },
};

export const OpenApiResp = <TModel extends Type<any>>(
  model: TModel,
  isPage?: boolean,
) => {
  const models = isPage ? [Resp, PageRes, model] : [Resp, model];
  const properties = isPage
    ? {
        data: {
          $ref: getSchemaPath(PageRes),
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: getSchemaPath(model),
              },
            },
          },
        },
      }
    : {
        data: {
          $ref: getSchemaPath(model),
        },
      };
  return applyDecorators(
    ApiExtraModels(...models),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Resp) },
          {
            properties: properties,
          },
        ],
      },
    }),
  );
};
