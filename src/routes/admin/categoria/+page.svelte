<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import {
        getAllCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    } from "$lib/assets/js/crud/categoriesCrud";

    let imageUrl = "";
    let form = {
        codigo: "",
        nombre: "",
        descripcion: "",
        imagen: "",
    };

    let items = [];
    let loading = false;
    let saving = false;
    let error = "";
    let success = "";
    let editingId = null;
    let validating = true;
    let openActionsId = null;

    onMount(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "/login";
                return;
            }
            validating = false;
            await loadItems();
        });
        return () => unsub();
    });

    function updateImagePreview(e) {
        imageUrl = e.target.value;
        form.imagen = e.target.value;
    }

    async function loadItems() {
        loading = true;
        error = "";
        try {
            items = await getAllCategories();
            items.sort((a, b) =>
                (a.nombre || "").localeCompare(b.nombre || ""),
            );
        } catch (e) {
            error = "Error al cargar categorías";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function resetForm() {
        form = {
            codigo: "",
            nombre: "",
            descripcion: "",
            imagen: "",
        };
        imageUrl = "";
        editingId = null;
    }

    function validateForm() {
        if (!form.codigo.trim() || !form.nombre.trim()) {
            error = "Código y nombre son requeridos";
            return false;
        }
        return true;
    }

    async function handleSubmit() {
        if (!validateForm()) return;
        saving = true;
        error = "";
        success = "";
        try {
            const payload = {
                codigo: form.codigo.trim(),
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                imagen: form.imagen.trim(),
            };
            if (editingId) {
                await updateCategory(editingId, payload);
                success = "Categoría actualizada correctamente";
            } else {
                await createCategory(payload);
                success = "Categoría creada correctamente";
            }
            await loadItems();
            resetForm();
        } catch (e) {
            error = "Error al guardar la categoría: " + e.message;
            console.error(e);
        } finally {
            saving = false;
        }
    }

    function startEdit(cat) {
        editingId = cat.id;
        form = {
            codigo: cat.codigo || "",
            nombre: cat.nombre || "",
            descripcion: cat.descripcion || "",
            imagen: cat.imagen || "",
        };
        imageUrl = form.imagen || "";
        document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleDelete(id) {
        const ok = confirm(
            "¿Eliminar esta categoría? Esta acción no se puede deshacer.",
        );
        if (!ok) return;
        try {
            await deleteCategory(id);
            await loadItems();
            success = "Categoría eliminada correctamente";
        } catch (e) {
            error = "Error al eliminar la categoría";
            console.error(e);
        }
    }

    function toggleActions(id) {
        openActionsId = openActionsId === id ? null : id;
    }
</script>

{#if validating}
    <div class="min-h-[40vh] flex items-center justify-center">
        <div class="text-center">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 py-8">
            {#if error}
                <div
                    class="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100"
                >
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span>{error}</span>
                    </div>
                </div>
            {/if}

            {#if success}
                <div
                    class="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-100"
                >
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>{success}</span>
                    </div>
                </div>
            {/if}

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 bg-white rounded-xl shadow p-6">
                    <h2 class="text-lg font-semibold mb-4">
                        {editingId ? "Editar" : "Agregar"} Categoría
                    </h2>

                    <form
                        class="space-y-3"
                        on:submit|preventDefault={handleSubmit}
                    >
                        <div class="space-y-1">
                            <label
                                for="codigo"
                                class="text-xs uppercase text-gray-500"
                                >Código <span class="text-red-500">*</span
                                ></label
                            >
                            <input
                                id="codigo"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.codigo}
                                required
                            />
                        </div>

                        <div class="space-y-1">
                            <label
                                for="nombre"
                                class="text-xs uppercase text-gray-500"
                                >Nombre <span class="text-red-500">*</span
                                ></label
                            >
                            <input
                                id="nombre"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.nombre}
                                required
                            />
                        </div>

                        <div class="space-y-1">
                            <label
                                for="descripcion"
                                class="text-xs uppercase text-gray-500"
                                >Descripción</label
                            >
                            <textarea
                                id="descripcion"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent min-h-[80px]"
                                bind:value={form.descripcion}
                                placeholder="Descripción de la categoría"
                            ></textarea>
                        </div>

                        <div class="space-y-1">
                            <label
                                for="imagen"
                                class="text-xs uppercase text-gray-500"
                                >URL de Imagen</label
                            >
                            <input
                                id="imagen"
                                type="url"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.imagen}
                                on:input={updateImagePreview}
                                placeholder="https://..."
                            />
                        </div>

                        <div class="flex gap-2 pt-2">
                            <button
                                type="submit"
                                class="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                disabled={saving}
                            >
                                {#if saving}
                                    <i class="fa-solid fa-spinner animate-spin"
                                    ></i>
                                    Guardando...
                                {:else}
                                    {editingId ? "Actualizar" : "Agregar"}
                                {/if}
                            </button>
                            {#if editingId}
                                <button
                                    type="button"
                                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition duration-150 ease-in-out"
                                    on:click={resetForm}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                            {/if}
                        </div>
                    </form>

                    <div class="mt-6 bg-gray-50 p-4 rounded-lg border">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">
                            Vista previa
                        </h3>
                        {#if form.imagen}
                            <div
                                class="bg-white p-3 rounded border flex items-center justify-center"
                            >
                                <img
                                    src={form.imagen}
                                    alt="Imagen de la categoría"
                                    class="max-h-32 max-w-full object-contain"
                                />
                            </div>
                            <p class="mt-2 text-xs text-gray-500 break-all">
                                {form.imagen}
                            </p>
                        {:else}
                            <div class="bg-gray-100 rounded p-8 text-center">
                                <i
                                    class="fa-solid fa-image text-gray-300 text-4xl mb-2"
                                ></i>
                                <p class="text-sm text-gray-500">
                                    Vista previa de la imagen
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="text-lg font-semibold">
                            Categorías ({items.length})
                        </h2>
                        {#if loading}
                            <div
                                class="flex items-center text-sm text-gray-500"
                            >
                                <i class="fa-solid fa-spinner animate-spin mr-2"
                                ></i>
                                Cargando...
                            </div>
                        {/if}
                    </div>

                    {#if items.length === 0 && !loading}
                        <div class="bg-white rounded-xl shadow p-8 text-center">
                            <i
                                class="fa-solid fa-tags text-4xl text-gray-300 mb-3"
                            ></i>
                            <h3 class="text-lg font-medium text-gray-700 mb-1">
                                No hay categorías
                            </h3>
                            <p class="text-gray-500">
                                Comienza agregando tu primera categoría
                            </p>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each items as cat}
                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div class="p-4">
                                        <div
                                            class="flex items-start justify-between gap-3"
                                        >
                                            <div
                                                class="flex items-center gap-3 min-w-0"
                                            >
                                                {#if cat.imagen}
                                                    <div
                                                        class="flex shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100"
                                                    >
                                                        <img
                                                            src={cat.imagen}
                                                            alt={cat.nombre}
                                                            class="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                {/if}
                                                <div class="min-w-0">
                                                    <h3
                                                        class="font-semibold text-gray-900 truncate"
                                                    >
                                                        {cat.nombre}
                                                    </h3>
                                                    {#if cat.codigo}
                                                        <p
                                                            class="text-xs text-gray-500 truncate"
                                                        >
                                                            Código: {cat.codigo}
                                                        </p>
                                                    {/if}
                                                </div>
                                            </div>

                                            <div class="relative">
                                                <button
                                                    type="button"
                                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-sm cursor-pointer"
                                                    on:click={() =>
                                                        toggleActions(cat.id)}
                                                >
                                                    <i
                                                        class="fa-solid fa-ellipsis-vertical"
                                                    ></i>
                                                </button>
                                                {#if openActionsId === cat.id}
                                                    <div
                                                        class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100"
                                                    >
                                                        <button
                                                            class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                            on:click={() => {
                                                                startEdit(cat);
                                                                openActionsId =
                                                                    null;
                                                            }}
                                                        >
                                                            <i
                                                                class="fa-regular fa-pen-to-square w-4 text-center"
                                                            ></i>
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            on:click={() => {
                                                                handleDelete(
                                                                    cat.id,
                                                                );
                                                                openActionsId =
                                                                    null;
                                                            }}
                                                        >
                                                            <i
                                                                class="fa-regular fa-trash-can w-4 text-center"
                                                            ></i>
                                                            <span>Eliminar</span
                                                            >
                                                        </button>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>

                                        {#if cat.descripcion}
                                            <p
                                                class="mt-3 text-sm text-gray-600 line-clamp-3"
                                            >
                                                {cat.descripcion}
                                            </p>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>
        </div>
    </div>
{/if}
