import { createClient } from '@supabase/supabase-js';
import { goto } from '$app/navigation';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL.toString(),
  import.meta.env.VITE_SUPABASE_ANON_KEY.toString()
);

export default db;

export const signIn = async ({ email, password }) => {
	try {
		const { user, error } = await db.auth.signIn({ email, password });
		if (error) {
			console.error(error);
		} else {
			location.replace('/authredirect');
			return user;
		}
	} catch (error) {
		console.error(error);
	}
};

export const signUp = async ({ email, password, username, first_name, last_name }) => {
	try {
		const { session, error } = await db.auth.signUp(
			{ email, password },
			{ data: { username, first_name, last_name, roles: ['registered'] } }
		);
		if (error) console.error(error);
		if (session?.user?.email_confirmed_at == null) {
			console.log('Registered. Please confirm your email');
		} else {
			console.log('Signed up successfully');
			location.replace('/authredirect');
		}
	} catch (error) {
		console.error(error);
	}
};

export const setServerCookie = async (sesh) => await fetch('api/cookie', { method: 'POST', body: JSON.stringify(sesh) });
export const unsetServerCookie = async () => await fetch('api/cookie', { method: 'DELETE' });

export const AUTH_REDIRECT = {
	headers: { Location: '/auth' },
	status: 302
};

export const auth = db.auth;

export const signOut = async () => {
	try {
		const { error } = await db.auth.signOut();
		if (error) console.error(error);
	} catch (error) {
		console.error(error);
	}
};