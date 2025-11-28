<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import { onAuthStateChanged } from "firebase/auth";

    import {
        getAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    } from "$lib/assets/js/crud/productsCrud";
    import { getAllProviders } from "$lib/assets/js/crud/providersCrud";
    import { getAllCategories } from "$lib/assets/js/crud/categoriesCrud";

    let imageUrl = "";

    let form = {
        Nombre: "",
        Marca: "",
        Fragancia: "",
        Leyenda: "",
        PrecioCompra: "",
        PrecioVenta: "",
        Stock: "",
        Descripcion: "",
        Imagen: "",
        ProveedorId: "",
        ProveedorNombre: "",
        CategoriaId: "",
        CategoriaNombre: "",
    };

    let products = [];
    let providers = [];
    let categories = [];
    let loading = false;
    let saving = false;
    let error = "";
    let success = "";
    let editingId = null;
    let validating = true;
    let openActionsId = null;

    // Validar sesión y cargar productos sólo si hay usuario.
    onMount(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // No autenticado → redirige a login
                window.location.href = "/login";
                return;
            }
            validating = false;
            await Promise.all([
                loadProducts(),
                loadProviders(),
                loadCategories(),
            ]);
        });
        return () => unsub();
    });

    function updateImagePreview(e) {
        imageUrl = e.target.value;
        form.Imagen = e.target.value;
    }

    async function loadProducts() {
        loading = true;
        error = "";
        try {
            products = await getAllProducts();
            // ordenar por nombre para consistencia (opcional)
            products.sort((a, b) =>
                (a.Nombre || "").localeCompare(b.Nombre || ""),
            );
        } catch (e) {
            error = "Error al cargar productos";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    async function loadProviders() {
        try {
            const list = await getAllProviders();
            providers = list.sort((a, b) =>
                (a.empresa || "").localeCompare(b.empresa || ""),
            );
        } catch (e) {
            console.error(e);
        }
    }

    async function loadCategories() {
        try {
            const list = await getAllCategories();
            categories = list.sort((a, b) =>
                (a.nombre || "").localeCompare(b.nombre || ""),
            );
        } catch (e) {
            console.error(e);
        }
    }

    function resetForm() {
        form = {
            Nombre: "",
            Marca: "",
            Fragancia: "",
            Leyenda: "",
            PrecioCompra: "",
            PrecioVenta: "",
            Stock: "",
            Descripcion: "",
            Imagen: "",
            ProveedorId: "",
            ProveedorNombre: "",
            CategoriaId: "",
            CategoriaNombre: "",
        };
        imageUrl = "";
        editingId = null;
    }

    function validateForm() {
        if (!form.Nombre.trim()) {
            error = "El nombre es requerido.";
            return false;
        }
        if (!form.PrecioVenta || Number(form.PrecioVenta) <= 0) {
            error = "El precio de venta debe ser mayor que 0.";
            return false;
        }
        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        error = "";
        success = "";

        if (!validateForm()) return;

        saving = true;

        const prov = providers.find((p) => p.id === form.ProveedorId);
        const cat = categories.find((c) => c.id === form.CategoriaId);

        const payload = {
            Nombre: form.Nombre.trim(),
            Marca: form.Marca.trim(),
            Fragancia: form.Fragancia.trim(),
            Leyenda: form.Leyenda.trim(),
            PrecioCompra: Number(form.PrecioCompra) || 0,
            PrecioVenta: Number(form.PrecioVenta) || 0,
            Stock: Number(form.Stock) || 0,
            Descripcion: form.Descripcion.trim(),
            Imagen: form.Imagen.trim(),
            ProveedorId: form.ProveedorId || "",
            ProveedorNombre: prov?.empresa || "",
            CategoriaId: form.CategoriaId || "",
            CategoriaNombre: cat?.nombre || "",
        };

        try {
            if (editingId) {
                await updateProduct(editingId, payload);
                success = "Producto actualizado";
            } else {
                await createProduct(payload);
                success = "Producto creado";
            }
            await loadProducts();
            resetForm();
        } catch (e) {
            error = "Error al guardar el producto";
            console.error(e);
        } finally {
            saving = false;
            // limpiar mensaje success en 3s
            setTimeout(() => (success = ""), 3000);
        }
    }

    function startEdit(product) {
        editingId = product.id;
        // normalizar campos por seguridad
        form = {
            Nombre: product.Nombre || "",
            Marca: product.Marca || "",
            Fragancia: product.Fragancia || "",
            Leyenda: product.Leyenda || "",
            PrecioCompra: product.PrecioCompra ?? "",
            PrecioVenta: product.PrecioVenta ?? "",
            Stock: product.Stock ?? "",
            Descripcion: product.Descripcion || "",
            Imagen: product.Imagen || "",
            ProveedorId: product.ProveedorId || "",
            ProveedorNombre: product.ProveedorNombre || "",
            CategoriaId: product.CategoriaId || "",
            CategoriaNombre: product.CategoriaNombre || "",
        };
        imageUrl = form.Imagen;
        // Scroll to top for UX (optional)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const ok = confirm(
            "¿Eliminar este producto? Esta acción no se puede deshacer.",
        );
        if (!ok) return;
        error = "";
        success = "";
        try {
            await deleteProduct(id);
            success = "Producto eliminado";
            await loadProducts();
        } catch (e) {
            error = "Error al eliminar el producto";
            console.error(e);
        } finally {
            setTimeout(() => (success = ""), 3000);
        }
    }

    // util para formatear dinero
    const fmt = (v) =>
        typeof v === "number"
            ? v.toLocaleString("es-CO", { minimumFractionDigits: 0 })
            : v;

    function toggleActions(id) {
        openActionsId = openActionsId === id ? null : id;
    }
</script>

{#if validating}
    <div class="min-h-[40vh] flex items-center justify-center">
        <div class="text-center">
            <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4"
            >
                <i class="fa-solid fa-pump-soap text-rose-600"></i>
            </div>
            <p class="text-gray-600">Validando sesión…</p>
        </div>
    </div>
{:else}
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- mensaje -->
        {#if error}
            <div
                class="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100"
            >
                {error}
            </div>
        {/if}
        {#if success}
            <div
                class="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-100"
            >
                {success}
            </div>
        {/if}

        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- FORM (col-span 1 on lg) -->
            <div class="lg:col-span-1 bg-white rounded-xl shadow p-6">
                <h2 class="text-lg font-semibold mb-4">
                    Agregar / Editar Producto
                </h2>

                <form class="space-y-3" on:submit|preventDefault={handleSubmit}>
                    <div>
                        <label
                            for="nombre"
                            class="text-xs uppercase text-gray-500"
                            >Nombre <span class="text-red-500">*</span></label
                        >
                        <input
                            id="nombre"
                            class="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-200"
                            bind:value={form.Nombre}
                            placeholder="Nombre del perfume"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                for="marca"
                                class="text-xs uppercase text-gray-500"
                                >Marca</label
                            >
                            <input
                                id="marca"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.Marca}
                                placeholder="Marca"
                            />
                        </div>
                        <div>
                            <label
                                for="fragancia"
                                class="text-xs uppercase text-gray-500"
                                >Fragancia</label
                            >
                            <input
                                id="fragancia"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.Fragancia}
                                placeholder="Ej: Floral, Amaderada"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="proveedor"
                            class="text-xs uppercase text-gray-500"
                            >Proveedor</label
                        >
                        <select
                            id="proveedor"
                            class="mt-1 w-full border rounded px-3 py-2 bg-white"
                            bind:value={form.ProveedorId}
                        >
                            <option value="">Sin proveedor</option>
                            {#each providers as pr}
                                <option value={pr.id}>{pr.empresa}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                for="categoria"
                                class="text-xs uppercase text-gray-500"
                                >Categoría</label
                            >
                            <select
                                id="categoria"
                                class="mt-1 w-full border rounded px-3 py-2 bg-white"
                                bind:value={form.CategoriaId}
                            >
                                <option value="">Sin categoría</option>
                                {#each categories as c}
                                    <option value={c.id}>{c.nombre}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label
                                for="leyenda"
                                class="text-xs uppercase text-gray-500"
                                >Leyenda</label
                            >
                            <input
                                id="leyenda"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.Leyenda}
                                placeholder="Mini leyenda para etiqueta"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label
                                for="precio-compra"
                                class="text-xs uppercase text-gray-500"
                                >Precio compra</label
                            >
                            <input
                                id="precio-compra"
                                type="number"
                                min="0"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.PrecioCompra}
                            />
                        </div>
                        <div>
                            <label
                                for="precio-venta"
                                class="text-xs uppercase text-gray-500"
                                >Precio venta <span class="text-red-500">*</span
                                ></label
                            >
                            <input
                                id="precio-venta"
                                type="number"
                                min="0"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.PrecioVenta}
                            />
                        </div>
                        <div>
                            <label
                                for="stock"
                                class="text-xs uppercase text-gray-500"
                                >Stock</label
                            >
                            <input
                                id="stock"
                                type="number"
                                min="0"
                                class="mt-1 w-full border rounded px-3 py-2"
                                bind:value={form.Stock}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="descripcion"
                            class="text-xs uppercase text-gray-500"
                            >Descripción</label
                        >
                        <textarea
                            id="descripcion"
                            rows="3"
                            class="mt-1 w-full border rounded px-3 py-2"
                            bind:value={form.Descripcion}
                            placeholder="Notas, ingredientes, packaging..."
                        ></textarea>
                    </div>

                    <div>
                        <label
                            for="imagen"
                            class="text-xs uppercase text-gray-500"
                            >URL de imagen</label
                        >
                        <input
                            id="imagen"
                            class="mt-1 w-full border rounded px-3 py-2"
                            bind:value={form.Imagen}
                            on:input={updateImagePreview}
                            placeholder="https://..."
                        />
                        <p class="text-xs text-gray-400 mt-1">
                            Puedes usar URLs de tu Storage o de un CDN. (Solo
                            texto, no upload aquí)
                        </p>
                    </div>

                    <div class="flex gap-2 mt-3">
                        <button
                            type="submit"
                            class="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 text-white py-2 rounded hover:bg-rose-700"
                        >
                            <i class="fa-solid fa-floppy-disk"></i>
                            <span
                                >{saving
                                    ? "Guardando..."
                                    : editingId
                                      ? "Actualizar"
                                      : "Agregar"}</span
                            >
                        </button>

                        <button
                            type="button"
                            class="inline-flex items-center gap-2 px-4 py-2 border rounded"
                            on:click={resetForm}
                        >
                            <i class="fa-solid fa-rotate-left"></i> Limpiar
                        </button>
                    </div>
                </form>

                <!-- PREVIEW -->
                <div class="mt-6 bg-gray-50 p-3 rounded">
                    <h3 class="text-sm font-medium text-gray-700 mb-2">
                        Vista previa
                    </h3>
                    {#if imageUrl}
                        <div class="w-full h-48 overflow-hidden rounded">
                            <img
                                src={imageUrl}
                                alt="preview"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <p class="text-xs text-gray-500 mt-2 break-all">
                            {imageUrl}
                        </p>
                    {:else}
                        <div
                            class="w-full h-48 flex items-center justify-center border-2 border-dashed rounded text-gray-400"
                        >
                            Sin imagen — pega la URL arriba
                        </div>
                    {/if}
                </div>
            </div>

            <!-- LISTA (col-span 2 on lg) -->
            <div class="lg:col-span-2">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold">
                        Productos ({products.length})
                    </h2>
                    <div class="text-sm text-gray-500">
                        Actualizado: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {#if loading}
                    <div class="p-6 bg-white rounded-xl shadow text-center">
                        Cargando inventario...
                    </div>
                {:else if products.length === 0}
                    <div class="p-6 bg-white rounded-xl shadow text-center">
                        No hay productos registrados.
                    </div>
                {:else}
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {#each products as p}
                            <article
                                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition duration-150 px-2"
                            >
                                <!-- Imagen -->
                                <div class="relative w-full h-44 bg-gray-100">
                                    {#if p.Imagen}
                                        <img
                                            src={p.Imagen}
                                            alt={p.Nombre}
                                            class="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    {:else}
                                        <div
                                            class="w-full h-full flex items-center justify-center text-gray-300"
                                        >
                                            <i
                                                class="fa-regular fa-image text-3xl"
                                            ></i>
                                        </div>
                                    {/if}

                                    <!-- Badge de stock -->
                                    <div
                                        class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/80 backdrop-blur text-gray-700 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-box-open"></i>
                                        <span>Stock: {p.Stock}</span>
                                    </div>

                                    <!-- Badge de precio venta -->
                                    <div
                                        class="absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-sm"
                                    >
                                        ${fmt(p.PrecioVenta)}
                                    </div>
                                </div>

                                <!-- Contenido -->
                                <div class="flex-1 p-4 flex flex-col gap-2">
                                    <div>
                                        <h3
                                            class="font-semibold text-base leading-snug text-gray-900 line-clamp-2"
                                        >
                                            {p.Nombre}
                                        </h3>
                                        {#if p.ProveedorNombre}
                                            <p
                                                class="text-xs text-gray-500 mt-0.5"
                                            >
                                                <i
                                                    class="fa-solid fa-truck text-gray-400 mr-1"
                                                ></i>
                                                {p.ProveedorNombre}
                                            </p>
                                        {/if}
                                        <p class="text-xs text-gray-500 mt-0.5">
                                            {#if p.Marca}
                                                <span class="font-medium"
                                                    >{p.Marca}</span
                                                >
                                            {/if}
                                            {#if p.CategoriaNombre}
                                                <span
                                                    class="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide"
                                                >
                                                    {p.CategoriaNombre}
                                                </span>
                                            {/if}
                                        </p>
                                    </div>

                                    {#if p.Descripcion}
                                        <p
                                            class="text-xs text-gray-600 mt-1 line-clamp-3"
                                        >
                                            {p.Descripcion}
                                        </p>
                                    {/if}

                                    <div
                                        class="mt-1 flex items-center justify-between text-[11px] text-gray-500"
                                    >
                                        <div>
                                            <span class="uppercase">Compra</span
                                            >
                                            <span
                                                class="ml-1 font-semibold text-gray-800"
                                                >${fmt(p.PrecioCompra)}</span
                                            >
                                        </div>
                                        <div>
                                            <span class="uppercase"
                                                >Utilidad</span
                                            >
                                            <span
                                                class="ml-1 font-semibold text-emerald-600"
                                            >
                                                ${fmt(
                                                    (p.PrecioVenta || 0) -
                                                        (p.PrecioCompra || 0),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Acciones -->
                                <div
                                    class="flex items-center justify-end pr-4 pb-1 pt-1"
                                >
                                    <button
                                        type="button"
                                        class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-xs cursor-pointer"
                                        aria-label="Mostrar acciones"
                                        on:click={() => toggleActions(p.id)}
                                    >
                                        <i class="fa-solid fa-gear"></i>
                                    </button>
                                </div>
                                {#if openActionsId === p.id}
                                    <div
                                        class="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50"
                                    >
                                        <button
                                            class="flex-1 px-3 py-1.5 bg-gray-900 text-white rounded text-xs flex items-center justify-center gap-1.5 hover:bg-black"
                                            on:click={() => startEdit(p)}
                                        >
                                            <i class="fa-solid fa-pen-to-square"
                                            ></i>
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            class="px-3 py-1.5 bg-red-50 text-red-700 rounded text-xs flex items-center justify-center gap-1.5 hover:bg-red-100"
                                            on:click={() => handleDelete(p.id)}
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                {/if}
                            </article>
                        {/each}
                    </div>
                {/if}
            </div>
        </section>
    </div>
{/if}
