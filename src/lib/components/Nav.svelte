<script>
    import { page, session } from '$app/stores';
    import { signOut } from '$lib/db';

	$: pathname = $page.url.pathname;
	$: userRoles = $session.user?.user_metadata?.roles || [];

    const ROUTES = [
        {route: "/", label: "HOME", roles: ['guest']}, 
        {route: "/todo", label: "TO DO", roles: ['registered']}, 
        {route: "/calendar", label: "CALENDAR", roles: ['registered']}
    ]
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
    {#if $session.authenticated}
         <button on:click={signOut}>LOG OUT</button> 
    {:else}
         <a href="/auth">LOG IN</a>
    {/if}
</nav>