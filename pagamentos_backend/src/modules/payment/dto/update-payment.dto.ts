import { IsOptional, IsString } from "class-validator";

export class UpdatePaymentDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string
}