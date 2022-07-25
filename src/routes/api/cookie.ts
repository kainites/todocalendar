import { cookieName } from '$lib/constants';

export const POST = async ({ request }) => {
	const session = request.body ? await request.json() : null;
	if (session) {
		return {
			status: 200,
			headers: {
				'set-cookie': `${cookieName}=${JSON.stringify(session)}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${
					session.expires_at ? new Date(session.expires_at * 1000).toUTCString() : 'Thu, 01 Jan 1970 00:00:00 UTC'
				};`
			}
		};
	} else {
		return {
			status: 400,
			body: 'Expecting JSON body, but body was null.'
		};
	}
};
export const DEL = () => {
	return {
		status: 204,
		headers: {
			'set-cookie': `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`
		}
	};
};