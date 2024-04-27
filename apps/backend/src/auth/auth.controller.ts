import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenApiResp } from 'src/core/response.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLoginReqDto, AuthLoginResDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('/api/v1')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Wallet Login' })
  @Post('login')
  @HttpCode(200)
  @OpenApiResp(AuthLoginResDto)
  async login(@Body() req: AuthLoginReqDto): Promise<AuthLoginResDto> {
    return {
      token: 'test',
    };
    return await this.authService.login(req);
  }
}
