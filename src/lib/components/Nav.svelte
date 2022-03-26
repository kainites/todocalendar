<script>
    const routes = [
        {route: "/", label: "home"}, 
        {route: "/todo", label: "to do"}, 
        {route: "/calendar", label: "calendar"}, 
    ]
</script>

<nav>
    {#each routes as route}
         <a href={route.route} sveltekit:prefetch>{route.label}</a>
    {/each}
</nav>