import bcrypt from 'bcrypt';

export const hashPass = (contrasenia: string) => bcrypt.hashSync(contrasenia, 5);

export const comparePass = (plain: string, hash: string) => bcrypt.compareSync(plain, hash);
