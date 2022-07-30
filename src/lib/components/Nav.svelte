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
         <button id="logOut" on:click={signOut}>LOG OUT</button> 
    {:else}
         <a href="/auth">LOG IN</a>
    {/if}
</nav>

<style>
    #logOut {
        background-color: var(--greenmid);
        color: var(--grayheader);
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 16px;
        margin: 0px 0px 0px 25px;
        border: none;
        padding: none;
    }
</style>