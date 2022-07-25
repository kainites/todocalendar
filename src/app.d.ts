/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		access_token;
		user;
		authenticated;
	}
	// interface Platform {}
	interface Session {
		user;
		authenticated;
	}
	// interface Stuff {}
}
