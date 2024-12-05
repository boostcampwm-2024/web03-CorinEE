import { Cookies } from 'react-cookie';

interface CookieOptions {
	path?: string;
	expires?: Date;
	maxAge?: number;
	domain?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

const cookies = new Cookies();

export function setCookie(
	name: string,
	value: string,
	options?: CookieOptions,
) {
	return cookies.set(name, value, { ...options });
}

export function getCookie(name: string) {
	return cookies.get(name);
}

export function removeCookie(name: string, options?: CookieOptions) {
	return cookies.remove(name, { ...options });
}
