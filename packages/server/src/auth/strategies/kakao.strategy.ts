import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: '',
      callbackURL: `${process.env.CALLBACK_URL}/api/auth/kakao/callback`
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    const { id, username, _json } = profile;
    const user = {
      provider: 'kakao',
      id,
      name: username,
      email: _json.kakao_account?.email,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
