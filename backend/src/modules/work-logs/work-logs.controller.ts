import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { QueryWorkLogDto } from './dto/query-work-log.dto';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) { }

  @Get()
  async findAll(@Query() query: QueryWorkLogDto) {
    return this.workLogsService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('Некорректный ID записи'),
      }),
    )
    id: string,
  ) {
    return this.workLogsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWorkLogDto: CreateWorkLogDto) {
    return this.workLogsService.create(createWorkLogDto);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('Некорректный ID записи'),
      }),
    )
    id: string,
    @Body() updateWorkLogDto: UpdateWorkLogDto,
  ) {
    return this.workLogsService.update(id, updateWorkLogDto);
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('Некорректный ID записи'),
      }),
    )
    id: string,
  ) {
    return this.workLogsService.remove(id);
  }
}
