<!-- +error.svelte for SvelteKit / Acorde 404 Page -->
<script>
    export let status = 404;
    export let error;
</script>

<div
    class="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6"
>
    <!-- Logo -->
    <div class="mb-10">
        <img src="/logo.svg" alt="Acorde Logo" class="w-28 opacity-90" />
    </div>

    <!-- Icon -->
    <i class="fa-solid fa-perfume text-7xl mb-8"></i>

    <!-- Title -->
    <h1 class="text-7xl font-extrabold tracking-tight">{status}</h1>

    <!-- Subtitle -->
    <p class="mt-4 text-2xl text-center max-w-xl leading-relaxed">
        {error?.message || "Este aroma no existe en nuestra colección."}
    </p>

    <!-- Divider -->
    <div class="w-24 h-px bg-black opacity-30 mt-10 mb-8"></div>

    <!-- Detailed text -->
    <p class="text-center max-w-2xl text-lg opacity-80 leading-relaxed">
        En <strong>Acorde</strong>, cada detalle importa como una nota precisa
        dentro de una fragancia. Es posible que la página haya sido eliminada,
        movida o que el enlace esté desactualizado. Puedes regresar al inicio
        para seguir explorando nuestras esencias.
    </p>

    <!-- Button -->
    <a
        href="/"
        class="mt-10 border border-black px-10 py-3 rounded-full text-lg font-semibold tracking-wide hover:bg-black hover:text-white transition duration-300 flex items-center gap-2"
    >
        <i class="fa-solid fa-house"></i>
        Volver al inicio
    </a>

    <!-- Footer -->
    <footer class="mt-16 text-sm opacity-50 text-center">
        © Acorde — Elegancia en cada nota.
    </footer>
</div>
