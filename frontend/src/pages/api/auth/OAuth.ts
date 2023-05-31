// kakao_login
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

// const KAKAO_REDIRECT_URI = "http://mohaeng.site/login/kakao";
const KAKAO_REDIRECT_URI = "http://localhost:3000/login/kakao";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
