import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsISO8601,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateWorkLogDto {
  @IsNotEmpty({ message: 'Дата обязательна для заполнения' })
  @IsISO8601({}, { message: 'Некорректный формат даты (ожидается ISO 8601)' })
  date!: string;

  @IsNotEmpty({ message: 'Объем работ обязателен для заполнения' })
  @IsNumber({}, { message: 'Объем должен быть числом' })
  @IsPositive({ message: 'Объем работ должен быть положительным числом' })
  volume!: number;

  @IsNotEmpty({ message: 'Единица измерения обязательна' })
  @IsString({ message: 'Единица измерения должна быть строкой' })
  @Length(1, 10, { message: 'Единица измерения должна содержать от 1 до 10 символов' })
  unit!: string;

  @IsNotEmpty({ message: 'ФИО исполнителя обязательно для заполнения' })
  @IsString({ message: 'ФИО исполнителя должно быть строкой' })
  @Length(2, 150, { message: 'ФИО исполнителя должно содержать от 2 до 150 символов' })
  workerName!: string;

  @IsNotEmpty({ message: 'Вид работы обязателен для выбора' })
  @IsUUID('4', { message: 'Некорректный идентификатор вида работы (ожидается UUID)' })
  workTypeId!: string;
}
