<script>
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from "$app/stores";

	let menuOpen = $state(false);
	let { children } = $props();

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Check if current route is admin
	let isAdminRoute = $derived($page.url.pathname.startsWith("/admin"));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !isAdminRoute}
	<nav
		class="sticky top-0 left-0 w-full bg-white border-b border-gray-200 z-50"
	>
		<div
			class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"
		>
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<img src="/logo-flat.svg" alt="logo-acorde" class="w-32" />
			</a>

			<!-- Desktop Menu -->
			<div
				class="hidden md:flex items-center gap-10 text-[15px] tracking-wide"
			>
				<a href="/" class="nav-link">HOME</a>
				<a href="/catalogo" class="nav-link">CATÁLOGO</a>
				<a href="/nosotros" class="nav-link">NOSOTROS</a>
				<a href="/contacto" class="nav-link">CONTACTO</a>
			</div>

			<!-- Mobile Button -->
			<button
				class="md:hidden text-2xl text-stone-900 hover:text-black transition"
				onclick={toggleMenu}
			>
				{#if menuOpen}
					<i class="fa-solid fa-xmark"></i>
				{:else}
					<i class="fa-solid fa-bars"></i>
				{/if}
			</button>
		</div>

		<!-- Mobile Menu -->
		<div
			class="md:hidden fixed top-[64px] left-0 right-0 bg-white border-t border-gray-200
	       overflow-hidden transition-all duration-300 z-40"
			style="
		max-height: {menuOpen ? '300px' : '0'};
		opacity: {menuOpen ? 1 : 0};
	"
		>
			<div
				class="px-6 py-4 flex flex-col gap-4 text-lg tracking-wide items-end"
			>
				<a
					href="/"
					class="text-stone-900 hover:text-black transition-colors"
					>HOME</a
				>
				<a
					href="/catalogo"
					class="text-stone-900 hover:text-black transition-colors"
					>CATÁLOGO</a
				>
				<a
					href="/nosotros"
					class="text-stone-900 hover:text-black transition-colors"
					>NOSOTROS</a
				>
				<a
					href="/contacto"
					class="text-stone-900 hover:text-black transition-colors"
					>CONTACTO</a
				>
			</div>
		</div>
	</nav>
{/if}

{@render children()}
