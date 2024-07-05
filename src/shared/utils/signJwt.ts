import jwt from 'jsonwebtoken';
import config from '../../configs';

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

export default function signJwt(payload: IJwtPayload) {
  return jwt.sign(payload, config.get('jwtSecretKey'), {
    expiresIn: '24h',
  });
}
