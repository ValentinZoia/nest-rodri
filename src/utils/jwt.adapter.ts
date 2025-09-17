import jwt from 'jsonwebtoken';

//Esto es una dependencia oculata, mejor inyctarla desde el constructor
const JWT_SECRET = process.env.JWT_SECRET;

export class JwtAdapter {
  static async generateToken(
    payload: Record<string, any>,
    isForAuth?: boolean,
    options: Record<string, any> = {
      expiresIn: '5h',
    },
  ): Promise<string | null> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwt.sign(payload, JWT_SECRET, isForAuth ? options : {}, (err, token) => {
        if (err) {
          console.log(err);
          return resolve(null);
        }
        resolve(token as string);
      });
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded as T);
      });
    });
  }
}
