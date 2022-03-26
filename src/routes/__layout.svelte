<script>
    import Navigation from '$lib/components/Nav.svelte';
    import '../app.css'
</script>

<header>
    <h1>welcome to your personal organiser</h1>
    <Navigation></Navigation>
</header>

<main>
    <slot></slot>
</main>

<footer>
    last edited: 4 march 2022
</footer>