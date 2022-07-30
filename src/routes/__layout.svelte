<script>
    import Navigation from '$lib/components/Nav.svelte';
    import '../app.css'
    
    import { browser } from '$app/env';
	import { session } from '$app/stores';
	import { ROUTE_AUTH } from '$lib/constants';
	import db, { setServerCookie, signOut, unsetServerCookie } from '$lib/db';

    db.auth.onAuthStateChange(async (event, sesh) => {
		if (event === 'SIGNED_IN') {
			const res = await setServerCookie(sesh);
			if (res.status === 200) {
				if (browser) $session = { user: sesh.user, authenticated: true };
			} else {
				console.error('Failed to set cookie', res);
				signOut();
			}
		} else if (event === 'SIGNED_OUT') {
			if (browser) $session = { user: {}, authenticated: false };
			const res = await unsetServerCookie();
			if (res.status !== 204) console.error('failed to expire cookie', res);
			location.replace(ROUTE_AUTH);
		}
	});
</script>

<header>
    <h1>To Do Calendar</h1>
    <Navigation></Navigation>
</header>

<main>
    <slot></slot>
</main>

<footer>
    BY <a href="https://github.com/kainites">KAI</a><a href="https://vercel.com/kainites">NITES</a>, MARCH-JULY 2022
</footer>