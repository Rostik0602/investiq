// Shape encoded into both access and refresh JWTs.
export interface JwtPayload {
  sub: string; // userId
  email: string;
}


export interface AuthenticatedUser {
  userId: string;
  email: string;
}


export interface AuthenticatedUserWithRefreshToken extends AuthenticatedUser {
  refreshToken: string;
}
