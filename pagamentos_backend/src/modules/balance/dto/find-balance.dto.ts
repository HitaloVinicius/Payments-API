import { IsUUID } from 'class-validator';

export class FindBalanceDto {
  @IsUUID('all', { message: 'O ID deve ser um UUID válido' })
  id: string;
}