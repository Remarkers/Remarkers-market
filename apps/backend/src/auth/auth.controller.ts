import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {ApiExtraModels, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLoginReqDto } from './dto/auth.dto';
import Resp, { RespBuilder } from 'src/core/response.dto';

@ApiTags('Auth')
@Controller('/api/v1')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Wallet Login' })
  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: Resp })
  async login(@Body() req: AuthLoginReqDto): Promise<string> {
    return await this.authService.login(req);
  }
}
