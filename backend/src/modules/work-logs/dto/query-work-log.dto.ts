import { IsOptional, IsString, IsISO8601, IsUUID, IsIn } from 'class-validator';

export class QueryWorkLogDto {
  @IsOptional()
  @IsISO8601({}, { message: 'Некорректный формат начальной даты' })
  startDate?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Некорректный формат конечной даты' })
  endDate?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Некорректный идентификатор вида работы' })
  workTypeId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['date', 'volume', 'workerName', 'workType'], {
    message: 'Сортировка возможна только по полям date, volume, workerName, workType',
  })
  sortBy?: string = 'date';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Направление сортировки может быть только asc или desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
