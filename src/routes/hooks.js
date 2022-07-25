import { auth } from '$lib/db';
import { cookieName } from '$lib/constants';
import cookie from 'cookie';

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	const session = cookies[cookieName] ? JSON.parse(cookies[cookieName]) : null;

	if (session?.access_token) {
		const { user, error } = await auth.api.getUser(session.access_token);
		event.locals.user = error ? {} : user;
		event.locals.authenticated = error ? false : true;
		event.locals.access_token = error ? null : session.access_token;
	} else {
		event.locals.user = {};
		event.locals.authenticated = false;
		event.locals.access_token = null;
	}

	const response = await resolve(event);

	return response;
};

export const getSession = async (event) => {
	const { user, authenticated } = event.locals;
	return {
		user,
		authenticated
	};
};