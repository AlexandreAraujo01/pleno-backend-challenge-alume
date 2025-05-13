import { randomUUID } from 'node:crypto';
import { TokenProvider } from '../../core/services/token-service';

export class FakeTokenProvider implements TokenProvider {
  sign(payload: object, options?: object): string {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = randomUUID();
    
    return `${header}.${body}.${signature}`;
  }
}
