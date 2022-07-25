<script lang="ts">
	import { signIn, signUp } from '$lib/db';

	let handleAuth = false;
	let action = 'signIn';
	let email = '',
		password = '',
		username = '',
		first_name = '',
		last_name = '';

	const signInOrSignUp = async () => {
		handleAuth = true;
		action === 'signIn' ? signIn({ email, password }) : signUp({ email, password, username, first_name, last_name });
		email = '';
		password = '';
		handleAuth = false;
	};
</script>

<section>
	<form on:submit|preventDefault={signInOrSignUp} class="grid max-w-lg gap-2 p-4 mx-auto my-10 border rounded">
		<h2>{action === 'signIn' ? 'Sign In' : 'Sign Up'}</h2>

		<input bind:value={email} type="email" placeholder="Email" />
		<input bind:value={password} type="password" placeholder="Password" />
		{#if action === 'signUp'}
			<input bind:value={username} type="text" placeholder="Username" />
			<input bind:value={first_name} type="text" placeholder="First Name" />
			<input bind:value={last_name} type="text" placeholder="Last Name" />
		{/if}
		<button class="border rounded bg-gray-300 hover:bg-gray-400">
			{handleAuth ? (action === 'signIn' ? 'Signing In...' : 'Signing Up...') : action === 'signIn' ? 'Sign In' : 'Sign Up'}
		</button>
        <p>
			{action === 'signIn' ? 'Not a member yet?' : 'Already a member?'}
			<span on:click|preventDefault={() => (action === 'signIn' ? (action = 'signUp') : (action = 'signIn'))} class="cursor-pointer">
				{action === 'signIn' ? 'Sign Up' : 'Sign In'}
			</span>
		</p>
	</form>
</section>