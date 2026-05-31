import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsISO8601,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateWorkLogDto {
  @IsOptional()
  @IsISO8601({}, { message: 'Некорректный формат даты (ожидается ISO 8601)' })
  date?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Объем должен быть числом' })
  @IsPositive({ message: 'Объем работ должен быть положительным числом' })
  volume?: number;

  @IsOptional()
  @IsString({ message: 'Единица измерения должна быть строкой' })
  @Length(1, 10, { message: 'Единица измерения должна содержать от 1 до 10 символов' })
  unit?: string;

  @IsOptional()
  @IsString({ message: 'ФИО исполнителя должно быть строкой' })
  @Length(2, 150, { message: 'ФИО исполнителя должно содержать от 2 до 150 символов' })
  workerName?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Некорректный идентификатор вида работы (ожидается UUID)' })
  workTypeId?: string;
}
