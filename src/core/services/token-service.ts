export abstract class TokenProvider {
  abstract sign(payload: object, options?: object): string;
}
