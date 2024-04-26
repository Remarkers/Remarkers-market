import { ApiProperty } from '@nestjs/swagger';

export default class Resp<T> {
  @ApiProperty({ title: 'Response code, 200 is success' })
  code: number;
  @ApiProperty({ title: 'Response data' })
  data?: T;
  @ApiProperty({ title: 'Response message' })
  message?: string;
}

export const RespBuilder = {
  ok<T>(data: T): Resp<T> {
    return {
      code: 200,
      data,
    };
  },
};
