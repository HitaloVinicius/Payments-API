import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'O balanceId não pode estar vazio.' })
  @IsUUID('all', { message: 'O ID deve ser um UUID válido' })
  balanceId: string

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