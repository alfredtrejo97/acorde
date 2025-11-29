<script>
    import { onMount } from "svelte";
    import { getAllProducts } from "$lib/assets/js/crud/productsCrud";
    import { getAllCategories } from "$lib/assets/js/crud/categoriesCrud";
    import ProductCard from "$lib/components/ProductView.svelte"; // Importar el componente

    let products = [];
    let filteredProducts = [];
    let categories = [];
    let loading = true;
    let searchQuery = "";
    let selectedCategory = "all";
    let error = "";

    onMount(async () => {
        try {
            // Load products and categories in parallel
            const [productsData, categoriesData] = await Promise.all([
                getAllProducts(),
                getAllCategories(),
            ]);

            products = productsData
                .filter((p) => p.Stock > 0) // Only show products with stock
                .sort((a, b) => a.Nombre.localeCompare(b.Nombre));

            filteredProducts = [...products];

            categories = categoriesData.sort((a, b) =>
                a.nombre.localeCompare(b.nombre),
            );
        } catch (e) {
            console.error("Error loading data:", e);
            error =
                "Error al cargar los productos. Por favor, intente de nuevo.";
        } finally {
            loading = false;
        }
    });

    function filterProducts() {
        filteredProducts = products.filter((product) => {
            const matchesSearch =
                product.Nombre.toLowerCase().includes(
                    searchQuery.toLowerCase(),
                ) ||
                product.Descripcion?.toLowerCase().includes(
                    searchQuery.toLowerCase(),
                );

            const matchesCategory =
                selectedCategory === "all" ||
                product.CategoriaId === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }

    $: if (products.length) {
        filterProducts();
    }

    // Función opcional para manejar agregar al carrito (si la necesitas)
    function handleAddToCart(product) {
        console.log("Agregar al carrito:", product);
        // Aquí puedes agregar la lógica del carrito
    }
</script>

<svelte:head>
    <title>Acorde - Catálogo</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white py-12">
        <div class="max-w-7xl mx-auto px-6">
            <h1 class="font-times text-5xl font-bold text-slate-900 mb-4">
                Nuestro Catálogo
            </h1>
            <p class="font-roboto-flex text-lg text-slate-600">
                Explora nuestra amplia selección de productos de calidad premium
            </p>
        </div>
    </section>

    <!-- Search and Filters Section -->
    <section class="bg-white border-b border-slate-200 py-8">
        <div class="max-w-7xl mx-auto px-6">
            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative max-w-2xl mx-auto">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                        type="text"
                        class="font-roboto-flex block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Buscar productos..."
                        bind:value={searchQuery}
                        on:input={filterProducts}
                    />
                </div>
            </div>

            <!-- Category Filters -->
            <div class="flex flex-wrap gap-2 justify-center">
                <button
                    class={`font-roboto-flex px-4 py-2 rounded-lg transition ${
                        selectedCategory === "all"
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                    }`}
                    on:click={() => {
                        selectedCategory = "all";
                        filterProducts();
                    }}
                >
                    Todos
                </button>

                {#each categories as category}
                    <button
                        class={`font-roboto-flex px-4 py-2 rounded-lg transition ${
                            selectedCategory === category.id
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        }`}
                        on:click={() => {
                            selectedCategory = category.id;
                            filterProducts();
                        }}
                    >
                        {category.nombre}
                    </button>
                {/each}
            </div>
        </div>
    </section>

    <!-- Products Grid -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
            {#if loading}
                <div class="text-center py-12">
                    <i
                        class="fas fa-spinner fa-spin text-4xl text-slate-400 mb-4"
                    ></i>
                    <p class="font-roboto-flex text-slate-600">
                        Cargando productos...
                    </p>
                </div>
            {:else if error}
                <div class="text-center py-12 text-red-500">
                    <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                    <p class="font-roboto-flex">{error}</p>
                </div>
            {:else if filteredProducts.length === 0}
                <div class="text-center py-12">
                    <i class="fas fa-box-open text-4xl text-slate-400 mb-4"></i>
                    <p class="font-roboto-flex text-slate-600">
                        No se encontraron productos que coincidan con tu
                        búsqueda.
                    </p>
                </div>
            {:else}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {#each filteredProducts as product}
                        <ProductCard {product} onAddToCart={handleAddToCart} />
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</div>
