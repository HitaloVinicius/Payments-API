import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBalanceDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string

  @IsNotEmpty({ message: 'O valor não pode estar vazio.' })
  @IsNumber({}, { message: 'O valor deve ser um número.' })
  value: number
}