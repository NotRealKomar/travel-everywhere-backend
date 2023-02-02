export class SignInResponse {
  readonly accessToken: string;

  readonly userId: string;

  constructor(accessToken: string, userId: string) {
    this.accessToken = accessToken;
    this.userId = userId;
  }
}
