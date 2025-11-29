<script>
    // Props que recibe el componente
    export let product;

    let showModal = false;

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price);
    };

    function openModal() {
        showModal = true;
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        showModal = false;
        document.body.style.overflow = "auto";
    }

    // Cerrar modal al presionar ESC
    function handleKeydown(e) {
        if (e.key === "Escape" && showModal) {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
    <!-- Imagen -->
    <div class="w-full h-48 overflow-hidden">
        <img
            src={product.Imagen}
            alt={product.Nombre}
            class="w-full h-full object-cover"
        />
    </div>

    <!-- CONTENIDO -->
    <div class="p-4 flex flex-col flex-1">
        <!-- Nombre + Precio -->
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-roboto-flex font-semibold text-lg text-slate-900">
                {product.Nombre}
            </h3>
            <span class="font-times font-bold text-slate-900 whitespace-nowrap">
                {formatPrice(product.PrecioVenta)}
            </span>
        </div>

        <!-- Categoría -->
        {#if product.CategoriaNombre}
            <span
                class="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded mb-3"
            >
                {product.CategoriaNombre}
            </span>
        {/if}

        <!-- Leyenda -->
        {#if product.Leyenda}
            <p class="text-sm text-slate-600 mb-4 line-clamp-2 italic">
                {product.Leyenda}
            </p>
        {/if}

        <!-- Empujar footer abajo -->
        <div class="flex-1"></div>

        <!-- FOOTER (siempre abajo) -->
        <div
            class="flex justify-between items-center pt-3 border-t border-slate-200"
        >
            <span class="text-sm text-slate-500 flex items-center gap-1">
                <i class="fas fa-box text-xs"></i>
                {product.Stock} en stock
            </span>

            <button
                class="font-roboto-flex text-slate-900 px-4 py-2 rounded hover:text-slate-600 transition text-md flex items-center gap-2 cursor-pointer font-bold"
                on:click={openModal}
                aria-label="Ver detalles del producto"
                tabindex="0"
                on:keydown={(e) => e.key === "Enter" && openModal()}
            >
                <span>Ver más...</span>
            </button>
        </div>
    </div>
</div>

<!-- Modal / Popup -->
{#if showModal}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/50 cursor-pointer z-40 transition-opacity"
        on:click={closeModal}
        aria-hidden="true"
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === "Enter" && closeModal()}
    ></div>

    <!-- Modal Content -->
    <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div
                class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all"
                on:click|stopPropagation
                role="button"
                tabindex="0"
                aria-labelledby="modal-title"
                aria-hidden="true"
            >
                <!-- Header del Modal -->
                <div
                    class="bg-black/95 text-white px-6 py-4 flex items-center justify-between"
                    id="modal-title"
                    aria-hidden="true"
                >
                    <h2 class="font-times text-2xl font-bold">
                        {product.Nombre}
                    </h2>
                    <button
                        class="text-white hover:text-gray-300 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-white/50"
                        on:click={closeModal}
                        aria-label="Cerrar modal"
                        tabindex="0"
                        on:keydown={(e) => e.key === "Enter" && closeModal()}
                        aria-hidden="true"
                    >
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <!-- Body del Modal -->
                <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <!-- Columna izquierda: Imagen -->
                        <div>
                            <div
                                class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                            >
                                {#if product.Imagen}
                                    <img
                                        src={product.Imagen}
                                        alt={product.Nombre}
                                        class="w-full h-full object-cover"
                                        on:error={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/600x600?text=Imagen+no+disponible";
                                        }}
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center"
                                    >
                                        <div class="text-center">
                                            <i
                                                class="fas fa-image text-6xl text-gray-300 mb-4"
                                            ></i>
                                            <p
                                                class="font-roboto-flex text-gray-400"
                                            >
                                                Sin imagen
                                            </p>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Columna derecha: Información -->
                        <div class="space-y-4">
                            <!-- Precio -->
                            <div>
                                <p
                                    class="text-sm text-slate-600 font-roboto-flex mb-1"
                                >
                                    Precio
                                </p>
                                <p
                                    class="text-3xl font-times font-bold text-slate-900"
                                >
                                    {formatPrice(product.PrecioVenta)}
                                </p>
                            </div>

                            <!-- Categoría -->
                            {#if product.CategoriaNombre}
                                <div>
                                    <p
                                        class="text-sm text-slate-600 font-roboto-flex mb-1"
                                    >
                                        Categoría
                                    </p>
                                    <span
                                        class="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        <i class="fas fa-tag mr-1"></i>
                                        {product.CategoriaNombre}
                                    </span>
                                </div>
                            {/if}

                            <!-- Marca -->
                            {#if product.Marca}
                                <div>
                                    <p
                                        class="text-sm text-slate-600 font-roboto-flex mb-1"
                                    >
                                        Marca
                                    </p>
                                    <p class="font-roboto-flex text-slate-900">
                                        <i class="fas fa-copyright mr-1"></i>
                                        {product.Marca}
                                    </p>
                                </div>
                            {/if}

                            <!-- Fragancia -->
                            {#if product.Fragancia}
                                <div>
                                    <p
                                        class="text-sm text-slate-600 font-roboto-flex mb-1"
                                    >
                                        Fragancia
                                    </p>
                                    <p class="font-roboto-flex text-slate-900">
                                        <i class="fas fa-spray-can mr-1"></i>
                                        {product.Fragancia}
                                    </p>
                                </div>
                            {/if}

                            <!-- Stock -->
                            <div>
                                <p
                                    class="text-sm text-slate-600 font-roboto-flex mb-1"
                                >
                                    Disponibilidad
                                </p>
                                <p class="font-roboto-flex text-slate-900">
                                    <i class="fas fa-box mr-1"></i>
                                    <span class="font-semibold"
                                        >{product.Stock}</span
                                    > unidades disponibles
                                </p>
                            </div>

                            <!-- Leyenda -->
                            {#if product.Leyenda}
                                <div
                                    class="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-900"
                                >
                                    <p
                                        class="font-roboto-flex text-slate-700 italic"
                                    >
                                        "{product.Leyenda}"
                                    </p>
                                </div>
                            {/if}

                            <!-- Descripción -->
                            {#if product.Descripcion}
                                <div>
                                    <p
                                        class="text-sm text-slate-600 font-roboto-flex mb-2 font-semibold"
                                    >
                                        Descripción
                                    </p>
                                    <p
                                        class="font-roboto-flex text-slate-700 leading-relaxed"
                                    >
                                        {product.Descripcion}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Footer del Modal -->
                    <div
                        class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3 justify-end"
                    >
                        <a
                            class="font-roboto-flex px-6 py-2 bg-black text-white rounded hover:bg-black/80 transition"
                            href={`https://wa.me/573195087461?text=Me%20gustaría%20adquirir%20el%20producto%20${encodeURIComponent(product.Nombre + " - " + product.Marca + " - " + product.Fragancia)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Adquirir producto por WhatsApp"
                        >
                            <i class="fas fa-shopping-cart mr-2"></i>
                            Adquirir
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
