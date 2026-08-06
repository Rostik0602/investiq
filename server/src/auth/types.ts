// Shape encoded into both access and refresh JWTs.
export interface JwtPayload {
  sub: string; // userId
  email: string;
}

// Shape attached to `request.user` after a guard validates a token —
// what @CurrentUser() hands to controllers.
export interface AuthenticatedUser {
  userId: string;
  email: string;
}

// What JwtRefreshStrategy attaches — includes the raw refresh token so
// AuthService can verify it against the stored bcrypt hash (lets us
// detect a stolen/reused token even though the JWT signature is valid).
export interface AuthenticatedUserWithRefreshToken extends AuthenticatedUser {
  refreshToken: string;
}
