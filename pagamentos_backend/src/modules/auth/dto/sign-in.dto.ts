import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Um e-mail válido deve ser fornecido.' })
  email: string

  @IsNotEmpty({ message: 'O password não pode estar vazio.' })
  @IsString({ message: 'O password deve ser uma string válida.' })
  @MinLength(8, { message: 'O password deve ter no mínimo 8 caracteres.' })
  password: string
}
