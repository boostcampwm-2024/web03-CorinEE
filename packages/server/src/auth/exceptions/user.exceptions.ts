export class UserNotFoundException extends Error {
  constructor(userId: number) {
    super(`유저 ${userId}가 존재하지 않습니다.`);
  }
}
