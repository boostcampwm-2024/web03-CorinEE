export type Login = {
	access_token: string;
	refresh_token: string;
};

export type LogOut = {
	message: string;
};

export type Profile = {
	userId: number;
	userName: string;
	iat: number;
	exp: number;
};
