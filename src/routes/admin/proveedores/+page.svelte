<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import {
        getAllProviders,
        createProvider,
        updateProvider,
        deleteProvider,
    } from "$lib/assets/js/crud/providersCrud";

    let imageUrl = "";
    let form = {
        empresa: "",
        direccion: "",
        telefono: "",
        email: "",
        website: "",
        contacto: "",
        pais: "",
        ciudad: "",
        notas: "",
        logo: "",
    };

    let suppliers = [];
    let loading = false;
    let saving = false;
    let error = "";
    let success = "";
    let editingId = null;
    let validating = true;
    let openActionsId = null;

    // Validar sesión y cargar proveedores
    onMount(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "/login";
                return;
            }
            validating = false;
            await loadSuppliers();
        });
        return () => unsub();
    });

    function updateImagePreview(e) {
        imageUrl = e.target.value;
        form.logo = e.target.value;
    }

    async function loadSuppliers() {
        loading = true;
        error = "";
        try {
            suppliers = await getAllProviders();
            suppliers.sort((a, b) =>
                (a.empresa || "").localeCompare(b.empresa || ""),
            );
        } catch (e) {
            error = "Error al cargar proveedores";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function resetForm() {
        form = {
            empresa: "",
            direccion: "",
            telefono: "",
            email: "",
            website: "",
            contacto: "",
            pais: "",
            ciudad: "",
            notas: "",
            logo: "",
        };
        imageUrl = "";
        editingId = null;
    }

    function validateForm() {
        if (!form.empresa.trim()) {
            error = "El nombre de la empresa es requerido";
            return false;
        }
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
            error = "Por favor ingresa un email válido";
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
            if (editingId) {
                await updateProvider(editingId, form);
                success = "Proveedor actualizado correctamente";
            } else {
                await createProvider(form);
                success = "Proveedor creado correctamente";
            }
            await loadSuppliers();
            resetForm();
        } catch (e) {
            error = "Error al guardar el proveedor: " + e.message;
            console.error(e);
        } finally {
            saving = false;
        }
    }

    function startEdit(supplier) {
        editingId = supplier.id;
        form = { ...supplier };
        imageUrl = supplier.logo || "";
        // Desplazarse al formulario
        document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleDelete(id) {
        const ok = confirm(
            "¿Eliminar este proveedor? Esta acción no se puede deshacer.",
        );
        if (!ok) return;

        try {
            await deleteProvider(id);
            await loadSuppliers();
            success = "Proveedor eliminado correctamente";
        } catch (e) {
            error = "Error al eliminar el proveedor";
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
            <!-- mensajes -->
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
                <!-- FORMULARIO -->
                <div class="lg:col-span-1 bg-white rounded-xl shadow p-6">
                    <h2 class="text-lg font-semibold mb-4">
                        {editingId ? "Editar" : "Agregar"} Proveedor
                    </h2>

                    <form
                        class="space-y-3"
                        on:submit|preventDefault={handleSubmit}
                    >
                        <div class="space-y-1">
                            <label
                                for="empresa"
                                class="text-xs uppercase text-gray-500"
                            >
                                Empresa <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="empresa"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.empresa}
                                required
                            />
                        </div>

                        <div class="space-y-1">
                            <label
                                for="contacto"
                                class="text-xs uppercase text-gray-500"
                            >
                                Contacto
                            </label>
                            <input
                                type="text"
                                id="contacto"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.contacto}
                            />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label
                                    for="email"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    bind:value={form.email}
                                />
                            </div>

                            <div class="space-y-1">
                                <label
                                    for="telefono"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    bind:value={form.telefono}
                                />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label
                                for="direccion"
                                class="text-xs uppercase text-gray-500"
                            >
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.direccion}
                            />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label
                                    for="pais"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    País
                                </label>
                                <input
                                    type="text"
                                    id="pais"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    bind:value={form.pais}
                                />
                            </div>

                            <div class="space-y-1">
                                <label
                                    for="ciudad"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="ciudad"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    bind:value={form.ciudad}
                                />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label
                                for="website"
                                class="text-xs uppercase text-gray-500"
                            >
                                Sitio Web
                            </label>
                            <input
                                type="url"
                                id="website"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.website}
                                placeholder="https://ejemplo.com"
                            />
                        </div>

                        <div class="space-y-1">
                            <label
                                for="logo"
                                class="text-xs uppercase text-gray-500"
                            >
                                URL del Logo
                            </label>
                            <input
                                type="url"
                                id="logo"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                bind:value={form.logo}
                                on:input={updateImagePreview}
                                placeholder="https://ejemplo.com/logo.png"
                            />
                        </div>

                        <div class="space-y-1">
                            <label
                                for="notas"
                                class="text-xs uppercase text-gray-500"
                            >
                                Notas
                            </label>
                            <textarea
                                id="notas"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent min-h-[80px]"
                                bind:value={form.notas}
                                placeholder="Información adicional del proveedor..."
                            ></textarea>
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
                                    {editingId ? "Actualizar" : "Agregar"} Proveedor
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

                    <!-- Vista previa del logo -->
                    <div class="mt-6 bg-gray-50 p-4 rounded-lg border">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">
                            Vista previa del logo
                        </h3>
                        {#if form.logo}
                            <div
                                class="bg-white p-3 rounded border flex items-center justify-center"
                            >
                                <img
                                    src={form.logo}
                                    alt="Logo del proveedor"
                                    class="max-h-32 max-w-full object-contain"
                                />
                            </div>
                            <p class="mt-2 text-xs text-gray-500 break-all">
                                {form.logo}
                            </p>
                        {:else}
                            <div class="bg-gray-100 rounded p-8 text-center">
                                <i
                                    class="fa-solid fa-image text-gray-300 text-4xl mb-2"
                                ></i>
                                <p class="text-sm text-gray-500">
                                    Vista previa del logo
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- LISTA DE PROVEEDORES -->
                <div class="lg:col-span-2">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="text-lg font-semibold">
                            Proveedores ({suppliers.length})
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

                    {#if suppliers.length === 0 && !loading}
                        <div class="bg-white rounded-xl shadow p-8 text-center">
                            <i
                                class="fa-solid fa-address-book text-4xl text-gray-300 mb-3"
                            ></i>
                            <h3 class="text-lg font-medium text-gray-700 mb-1">
                                No hay proveedores
                            </h3>
                            <p class="text-gray-500 mb-4">
                                Comienza agregando tu primer proveedor
                            </p>
                            <button
                                class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                                on:click={() => {
                                    editingId = null;
                                    resetForm();
                                    document
                                        .querySelector("form")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            >
                                <i class="fa-solid fa-plus mr-1"></i> Agregar Proveedor
                            </button>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each suppliers as supplier}
                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div class="p-4">
                                        <div
                                            class="flex items-start justify-between"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    {#if supplier.logo}
                                                        <div
                                                            class="flex shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100"
                                                        >
                                                            <img
                                                                src={supplier.logo}
                                                                alt={`Logo de ${supplier.empresa}`}
                                                                class="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                    {/if}
                                                    <h3
                                                        class="font-semibold text-gray-900 truncate"
                                                    >
                                                        {supplier.empresa}
                                                    </h3>
                                                </div>

                                                {#if supplier.contacto}
                                                    <p
                                                        class="mt-1 text-sm text-gray-600 flex items-center"
                                                    >
                                                        <i
                                                            class="fa-regular fa-user mr-1.5 text-gray-400 w-4 text-center"
                                                        ></i>
                                                        {supplier.contacto}
                                                    </p>
                                                {/if}

                                                <div class="mt-2 space-y-1">
                                                    {#if supplier.email}
                                                        <p
                                                            class="text-sm text-gray-600 flex items-center"
                                                        >
                                                            <i
                                                                class="fa-regular fa-envelope mr-1.5 text-gray-400 w-4 text-center"
                                                            ></i>
                                                            <a
                                                                href="mailto:{supplier.email}"
                                                                class="hover:text-blue-600 hover:underline"
                                                            >
                                                                {supplier.email}
                                                            </a>
                                                        </p>
                                                    {/if}

                                                    {#if supplier.telefono}
                                                        <p
                                                            class="text-sm text-gray-600 flex items-center"
                                                        >
                                                            <i
                                                                class="fa-solid fa-phone mr-1.5 text-gray-400 w-4 text-center"
                                                            ></i>
                                                            <a
                                                                href="tel:{supplier.telefono}"
                                                                class="hover:text-blue-600 hover:underline"
                                                            >
                                                                {supplier.telefono}
                                                            </a>
                                                        </p>
                                                    {/if}

                                                    {#if supplier.direccion}
                                                        <p
                                                            class="text-sm text-gray-600 flex items-start"
                                                        >
                                                            <i
                                                                class="fa-solid fa-location-dot mr-1.5 text-gray-400 mt-0.5 flex shrink-0"
                                                            ></i>
                                                            <span
                                                                class="line-clamp-2 overflow-hidden text-ellipsis"
                                                            >
                                                                {supplier.direccion}{#if supplier.ciudad},
                                                                    {supplier.ciudad}{/if}{#if supplier.pais},
                                                                    {supplier.pais}{/if}
                                                            </span>
                                                        </p>
                                                    {/if}

                                                    {#if supplier.website}
                                                        <p
                                                            class="text-sm text-gray-600 flex items-center"
                                                        >
                                                            <i
                                                                class="fa-solid fa-globe mr-1.5 text-gray-400 w-4 text-center"
                                                            ></i>
                                                            <a
                                                                href={supplier.website.startsWith(
                                                                    "http",
                                                                )
                                                                    ? supplier.website
                                                                    : "https://" +
                                                                      supplier.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                class="text-blue-600 hover:underline truncate"
                                                            >
                                                                {supplier.website.replace(
                                                                    /^https?:\/\//,
                                                                    "",
                                                                )}
                                                            </a>
                                                        </p>
                                                    {/if}
                                                </div>
                                            </div>

                                            <!-- Botón de acciones -->
                                            <div class="relative">
                                                <button
                                                    type="button"
                                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-sm cursor-pointer"
                                                    aria-label="Mostrar acciones"
                                                    on:click={() =>
                                                        toggleActions(
                                                            supplier.id,
                                                        )}
                                                >
                                                    <i
                                                        class="fa-solid fa-ellipsis-vertical"
                                                    ></i>
                                                </button>

                                                {#if openActionsId === supplier.id}
                                                    <div
                                                        class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100"
                                                    >
                                                        <button
                                                            class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                            on:click={() => {
                                                                startEdit(
                                                                    supplier,
                                                                );
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
                                                                    supplier.id,
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

                                        {#if supplier.notas}
                                            <div
                                                class="mt-3 pt-3 border-t border-gray-100"
                                            >
                                                <p
                                                    class="text-xs text-gray-500 italic"
                                                >
                                                    <span class="font-medium"
                                                        >Notas:</span
                                                    >
                                                    {supplier.notas}
                                                </p>
                                            </div>
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
