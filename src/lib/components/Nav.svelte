<script>
    import { page, session } from '$app/stores';

	$: pathname = $page.url.pathname;
	$: userRoles = $session.user?.user_metadata?.roles || [];
    $: console.log('session', $session)

    const ROUTES = [
        {route: "/", label: "home", roles: ['guest']}, 
        {route: "/todo", label: "to do", roles: ['registered']}, 
        {route: "/calendar", label: "calendar", roles: ['registered']}, 
        {route: "/auth", label: "log in", roles:['guest']}
    ]
    $: console.log(ROUTES)
</script>

<nav class="flex gap-4">
	{#each ROUTES as { route, label, roles }}
        {#if roles.includes('guest')}
            <a sveltekit:prefetch href={route} class:active={route === '/' ? (pathname === '/' ? true : false) : pathname.includes(route)}>
				{label}
			</a>
		{:else if $session.authenticated && roles.some((role) => userRoles.includes(role))}
            <a sveltekit:prefetch href={route} class:active={route === '/' ? (pathname === '/' ? true : false) : pathname.includes(route)}>
				{label}
			</a>
		{/if}
	{/each}
</nav>