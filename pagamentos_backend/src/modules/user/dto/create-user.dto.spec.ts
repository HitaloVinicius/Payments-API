import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should be valid when correct data is provided', async () => {
    const dto = new CreateUserDto();
    dto.email = 'leonard.hofstadter@incentive.me';
    dto.password = 'password1';
    dto.name = 'Leonard Hofstadter'

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be fail when email is empty', async () => {
    const dto = new CreateUserDto();
    dto.email = '';
    dto.password = 'password1';
    dto.name = 'Leonard Hofstadter'

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty', 'O e-mail não pode estar vazio.');
  });

  it('should be fail when email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'leonard.hofstadter@incentive';
    dto.password = 'password1';
    dto.name = 'Leonard Hofstadter'

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail', 'Um e-mail válido deve ser fornecido.');
  });

  it('should be fail when password is empty', async () => {
    const dto = new CreateUserDto();
    dto.email = 'leonard.hofstadter@incentive.me';
    dto.password = '';
    dto.name = 'Leonard Hofstadter'

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty', 'O password não pode estar vazio.');
  });

  it('should be fail when password is short', async () => {
    const dto = new CreateUserDto();
    dto.email = 'leonard.hofstadter@incentive.me';
    dto.password = '123';
    dto.name = 'Leonard Hofstadter'

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength', 'O password deve ter no mínimo 8 caracteres.');
  });
});
