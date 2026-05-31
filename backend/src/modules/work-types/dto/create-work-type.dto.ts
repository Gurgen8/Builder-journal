import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWorkTypeDto {
  @IsNotEmpty({ message: 'Наименование не должно быть пустым' })
  @IsString({ message: 'Наименование должно быть строкой' })
  @Length(2, 100, { message: 'Наименование должно содержать от 2 до 100 символов' })
  name!: string;
}
