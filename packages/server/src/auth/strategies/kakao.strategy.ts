import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/auth/google/callback'
      : 'https://www.corinee.site/api/auth/google/callback',
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
      photo: _json.properties?.profile_image,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
