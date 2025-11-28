<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import {
        getAllBalance,
        createBalance,
        updateBalance,
        deleteBalance,
    } from "$lib/assets/js/crud/balanceCrud";
    import {
        getAllProducts,
        reduceStock,
    } from "$lib/assets/js/crud/productsCrud";

    let sortOrder = "desc"; // desc = más nuevo primero, asc = más viejo primero

    let validating = true;
    let loading = false;
    let saving = false;
    let error = "";
    let success = "";

    let entries = [];
    let editingId = null;
    let openActionsId = null;

    const categoriasIngreso = ["Ventas"]; // Solo 'Ventas' para ingresos
    const categoriasEgreso = [
        "Compras",
        "Proveedores",
        "Nómina",
        "Servicios públicos",
        "Renta",
        "Impuestos",
        "Gastos varios",
        "Mantenimiento",
        "Otros egresos",
    ];

    let form = {
        ingreso: true,
        categoria: "",
        monto: "",
        fecha: "",
        descripcion: "",
    };

    // Productos de inventario para ventas
    let invProducts = [];
    let selectedProductId = "";
    let quantity = 1;

    function resetForm() {
        form = {
            ingreso: true,
            categoria: "",
            monto: "",
            fecha: "",
            descripcion: "",
        };
        editingId = null;
        selectedProductId = "";
        quantity = 1;
    }

    function toDateFieldValue(v) {
        if (!v) return "";
        const d = v?.toDate ? v.toDate() : v instanceof Date ? v : new Date(v);
        if (isNaN(d)) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    const cop = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    function formatCOP(n, isIngreso) {
        const val = Number(n || 0);
        return cop.format(isIngreso ? val : -val);
    }

    onMount(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "/login";
                return;
            }
            validating = false;
            await loadEntries();
            await loadProducts();
        });
        return () => unsub();
    });

    async function loadProducts() {
        try {
            invProducts = await getAllProducts();
            invProducts.sort((a, b) =>
                (a.Nombre || "").localeCompare(b.Nombre || ""),
            );
        } catch (e) {
            console.error(e);
        }
    }

    async function loadEntries() {
        loading = true;
        error = "";
        try {
            entries = await getAllBalance();
            entries.sort((a, b) => {
                const ad = a.fecha?.toDate
                    ? a.fecha.toDate()
                    : a.fecha
                      ? new Date(a.fecha)
                      : a.createdAt?.toDate?.() || 0;
                const bd = b.fecha?.toDate
                    ? b.fecha.toDate()
                    : b.fecha
                      ? new Date(b.fecha)
                      : b.createdAt?.toDate?.() || 0;
                return (bd?.getTime?.() || 0) - (ad?.getTime?.() || 0);
            });
        } catch (e) {
            error = "Error al cargar movimientos";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    $: sortedEntries = [...entries].sort((a, b) => {
        const ad = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha);
        const bd = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha);

        if (sortOrder === "asc") {
            // más viejo → más nuevo
            return ad - bd;
        } else {
            // más nuevo → más viejo
            return bd - ad;
        }
    });

    function validateForm() {
        if (!form.categoria.trim()) {
            error = "La categoría es requerida";
            return false;
        }
        const montoNum = Number(form.monto);
        if (!montoNum || montoNum <= 0) {
            error = "El monto debe ser mayor que 0";
            return false;
        }
        if (!form.fecha) {
            error = "La fecha es requerida";
            return false;
        }
        if (form.ingreso && form.categoria === "Ventas") {
            if (!selectedProductId) {
                error = "Selecciona un producto para la venta";
                return false;
            }
            const q = Number(quantity || 0);
            if (q <= 0) {
                error = "La cantidad debe ser al menos 1";
                return false;
            }
        }
        return true;
    }

    // Forzar 'Ventas' cuando es ingreso
    $: if (form.ingreso && form.categoria !== "Ventas") {
        form.categoria = "Ventas";
    }

    // Recalcular monto automáticamente cuando es venta
    $: if (form.ingreso && form.categoria === "Ventas") {
        const prod = invProducts.find((p) => p.id === selectedProductId);
        const unit = Number(prod?.PrecioVenta || 0);
        const qty = Number(quantity || 0);
        const total = unit * qty;
        if (!isNaN(total)) {
            form.monto = String(total);
            if (!editingId && prod && qty > 0) {
                form.descripcion = `Venta de ${prod.Nombre} x ${qty}`;
            }
        }
    }

    async function handleSubmit() {
        if (!validateForm()) return;
        saving = true;
        error = "";
        success = "";
        try {
            const payload = {
                ingreso: !!form.ingreso,
                categoria: form.categoria,
                monto: Number(form.monto),
                fecha: form.fecha,
                descripcion: form.descripcion || "",
            };

            // Si es una venta (ingreso con categoría Ventas), reducir stock
            if (
                form.ingreso &&
                form.categoria === "Ventas" &&
                selectedProductId &&
                !editingId
            ) {
                const qty = Number(quantity || 0);
                if (qty > 0) {
                    await reduceStock(selectedProductId, qty);
                    payload.productId = selectedProductId;
                    payload.quantitySold = qty;
                }
            }

            if (editingId) {
                await updateBalance(editingId, payload);
                success = "Movimiento actualizado correctamente";
            } else {
                await createBalance(payload);
                success = "Movimiento registrado correctamente";
            }
            await loadEntries();
            await loadProducts(); // Recargar productos para actualizar stock
            resetForm();
        } catch (e) {
            error = "Error al guardar el movimiento: " + e.message;
            console.error(e);
        } finally {
            saving = false;
        }
    }

    function startEdit(item) {
        editingId = item.id;
        form = {
            ingreso: !!item.ingreso,
            categoria: item.categoria || "",
            monto: item.monto ?? "",
            fecha: toDateFieldValue(item.fecha || item.createdAt),
            descripcion: item.descripcion || "",
        };
        document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleDelete(id) {
        const ok = confirm(
            "¿Eliminar este movimiento? Esta acción no se puede deshacer.",
        );
        if (!ok) return;
        try {
            await deleteBalance(id);
            await loadEntries();
            success = "Movimiento eliminado correctamente";
        } catch (e) {
            error = "Error al eliminar el movimiento";
            console.error(e);
        }
    }

    function toggleActions(id) {
        openActionsId = openActionsId === id ? null : id;
    }

    function entryDateStr(item) {
        const d = item.fecha?.toDate
            ? item.fecha.toDate()
            : item.fecha
              ? new Date(item.fecha)
              : null;
        if (!d || isNaN(d)) return "";
        return d.toLocaleDateString("es-CO");
    }

    $: totalIngresos = entries
        .filter((e) => e.ingreso)
        .reduce((acc, e) => acc + (Number(e.monto) || 0), 0);
    $: totalEgresos = entries
        .filter((e) => !e.ingreso)
        .reduce((acc, e) => acc + (Number(e.monto) || 0), 0);
    $: saldo = totalIngresos - totalEgresos;
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
                        {editingId ? "Editar" : "Registrar"} Movimiento
                    </h2>

                    <form
                        class="space-y-3"
                        on:submit|preventDefault={handleSubmit}
                    >
                        <div class="space-y-1">
                            <label
                                for="tipo"
                                class="text-xs uppercase text-gray-500"
                            >
                                Tipo
                            </label>
                            <div class="flex gap-4">
                                <label
                                    class="inline-flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="radio"
                                        name="tipo"
                                        checked={form.ingreso}
                                        on:change={() => {
                                            form.ingreso = true;
                                            form.categoria = "Ventas";
                                        }}
                                    />
                                    <span>Ingreso</span>
                                </label>
                                <label
                                    class="inline-flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="radio"
                                        name="tipo"
                                        checked={!form.ingreso}
                                        on:change={() => {
                                            form.ingreso = false;
                                            form.categoria = "";
                                            selectedProductId = "";
                                            quantity = 1;
                                        }}
                                    />
                                    <span>Egreso</span>
                                </label>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label
                                for="categoria"
                                class="text-xs uppercase text-gray-500"
                            >
                                Categoría <span class="text-red-500">*</span>
                            </label>
                            <select
                                id="categoria"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                                bind:value={form.categoria}
                                required
                            >
                                <option value="" disabled selected
                                    >Selecciona una categoría</option
                                >
                                {#each form.ingreso ? categoriasIngreso : categoriasEgreso as c}
                                    <option value={c}>{c}</option>
                                {/each}
                            </select>
                        </div>

                        {#if form.ingreso && form.categoria === "Ventas"}
                            <div
                                class="space-y-3 p-3 rounded-lg bg-gray-50 border"
                            >
                                <div>
                                    <label
                                        for="producto"
                                        class="text-xs uppercase text-gray-500"
                                    >
                                        Producto a vender
                                    </label>
                                    <select
                                        id="producto"
                                        class="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-black focus:border-transparent"
                                        bind:value={selectedProductId}
                                    >
                                        <option value=""
                                            >Selecciona un producto</option
                                        >
                                        {#each invProducts as p}
                                            <option value={p.id}>
                                                {p.Nombre} — Stock: {p.Stock} — ${p.PrecioVenta}
                                            </option>
                                        {/each}
                                    </select>
                                </div>

                                <div
                                    class="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                    <div>
                                        <label
                                            for="cantidad"
                                            class="text-xs uppercase text-gray-500"
                                            >Cantidad</label
                                        >
                                        <input
                                            id="cantidad"
                                            type="number"
                                            min="1"
                                            class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                            bind:value={quantity}
                                        />
                                        {#if selectedProductId}
                                            {#each invProducts.filter((p) => p.id === selectedProductId) as s}
                                                <p
                                                    class="text-xs text-gray-500 mt-1"
                                                >
                                                    Stock disponible: {s.Stock}
                                                </p>
                                            {/each}
                                        {/if}
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label
                                            for="total"
                                            class="text-xs uppercase text-gray-500"
                                            >Total</label
                                        >
                                        <div
                                            class="p-2 border rounded bg-white"
                                        >
                                            {formatCOP(form.monto || 0, true)}
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">
                                            El monto se calcula automáticamente
                                            por PrecioVenta x Cantidad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label
                                    for="monto"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    Monto <span class="text-red-500">*</span>
                                </label>
                                <input
                                    id="monto"
                                    type="number"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                    bind:value={form.monto}
                                    required
                                />
                                <p class="text-xs text-gray-500">
                                    Vista: {formatCOP(
                                        form.monto || 0,
                                        form.ingreso,
                                    )}
                                </p>
                            </div>

                            <div class="space-y-1">
                                <label
                                    for="fecha"
                                    class="text-xs uppercase text-gray-500"
                                >
                                    Fecha <span class="text-red-500">*</span>
                                </label>
                                <input
                                    id="fecha"
                                    type="date"
                                    class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                                    bind:value={form.fecha}
                                    required
                                />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label
                                for="descripcion"
                                class="text-xs uppercase text-gray-500"
                            >
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent min-h-[80px]"
                                bind:value={form.descripcion}
                                placeholder="Detalle del movimiento"
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
                                    {editingId ? "Actualizar" : "Registrar"}
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
                </div>

                <div class="lg:col-span-2">
                    <div
                        class="mb-4 flex items-center justify-between gap-4 flex-wrap"
                    >
                        <h2 class="text-lg font-semibold">
                            Movimientos ({entries.length})
                        </h2>

                        <div class="flex items-center gap-3 text-sm">
                            <label
                                for="sortOrder"
                                class="text-gray-600 font-medium"
                            >
                                Ordenar por:
                            </label>

                            <select
                                id="sortOrder"
                                bind:value={sortOrder}
                                class="w-28 px-3 py-2 rounded-lg border border-gray-300 bg-white
                   text-gray-700 appearance-none focus:ring-2 focus:ring-stone-700
                   focus:border-stone-700 transition-all duration-150"
                            >
                                <option value="desc" class="px-3">
                                    Nuevo
                                </option>
                                <option value="asc" class="px-3">
                                    Antiguo
                                </option>
                            </select>
                        </div>

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

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div class="bg-white rounded-xl border p-4">
                            <p class="text-xs uppercase text-gray-500">
                                Ingresos
                            </p>
                            <p class="text-lg font-semibold text-green-600">
                                {cop.format(totalIngresos)}
                            </p>
                        </div>
                        <div class="bg-white rounded-xl border p-4">
                            <p class="text-xs uppercase text-gray-500">
                                Egresos
                            </p>
                            <p class="text-lg font-semibold text-red-600">
                                {cop.format(totalEgresos)}
                            </p>
                        </div>
                        <div class="bg-white rounded-xl border p-4">
                            <p class="text-xs uppercase text-gray-500">Saldo</p>
                            <p class="text-lg font-semibold">
                                {cop.format(saldo)}
                            </p>
                        </div>
                    </div>

                    {#if entries.length === 0 && !loading}
                        <div class="bg-white rounded-xl shadow p-8 text-center">
                            <i
                                class="fa-solid fa-balance-scale text-4xl text-gray-300 mb-3"
                            ></i>
                            <h3 class="text-lg font-medium text-gray-700 mb-1">
                                Sin movimientos
                            </h3>
                            <p class="text-gray-500">
                                Registra tu primer ingreso o egreso
                            </p>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each sortedEntries as item}
                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div class="p-4">
                                        <div
                                            class="flex items-start justify-between"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <div
                                                    class="flex items-center gap-2 flex-wrap"
                                                >
                                                    <span
                                                        class="px-2 py-0.5 text-xs rounded-full border font-medium {item.ingreso
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'}"
                                                    >
                                                        {item.ingreso
                                                            ? "Ingreso"
                                                            : "Egreso"}
                                                    </span>
                                                    {#if item.categoria}
                                                        <span
                                                            class="text-sm text-gray-700 font-medium"
                                                            >{item.categoria}</span
                                                        >
                                                    {/if}
                                                </div>
                                                {#if item.descripcion}
                                                    <p
                                                        class="mt-1 text-sm text-gray-600 line-clamp-2"
                                                    >
                                                        {item.descripcion}
                                                    </p>
                                                {/if}
                                                <p
                                                    class="mt-2 text-xs text-gray-500"
                                                >
                                                    {entryDateStr(item)}
                                                </p>
                                            </div>

                                            <div class="text-right">
                                                <div
                                                    class="text-base font-semibold {item.ingreso
                                                        ? 'text-green-600'
                                                        : 'text-red-600'}"
                                                >
                                                    {formatCOP(
                                                        item.monto,
                                                        item.ingreso,
                                                    )}
                                                </div>
                                                <div class="relative mt-2">
                                                    <button
                                                        type="button"
                                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-sm cursor-pointer"
                                                        aria-label="Mostrar acciones"
                                                        on:click={() =>
                                                            toggleActions(
                                                                item.id,
                                                            )}
                                                    >
                                                        <i
                                                            class="fa-solid fa-ellipsis-vertical"
                                                        ></i>
                                                    </button>

                                                    {#if openActionsId === item.id}
                                                        <div
                                                            class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100"
                                                        >
                                                            <button
                                                                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                on:click={() => {
                                                                    startEdit(
                                                                        item,
                                                                    );
                                                                    openActionsId =
                                                                        null;
                                                                }}
                                                            >
                                                                <i
                                                                    class="fa-regular fa-pen-to-square w-4 text-center"
                                                                ></i>
                                                                <span
                                                                    >Editar</span
                                                                >
                                                            </button>
                                                            <button
                                                                class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                on:click={() => {
                                                                    handleDelete(
                                                                        item.id,
                                                                    );
                                                                    openActionsId =
                                                                        null;
                                                                }}
                                                            >
                                                                <i
                                                                    class="fa-regular fa-trash-can w-4 text-center"
                                                                ></i>
                                                                <span
                                                                    >Eliminar</span
                                                                >
                                                            </button>
                                                        </div>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
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
