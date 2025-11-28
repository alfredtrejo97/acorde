<script>
    import { onMount } from "svelte";
    import {
        getDashboardData,
        formatCurrency,
        formatDate,
    } from "$lib/assets/js/utils/dashboardData";

    let dashboardData = {
        totalIngresos: 0,
        totalEgresos: 0,
        balance: 0,
        recentTransactions: [],
        totalProducts: 0,
        totalStock: 0,
        lowStockProducts: 0,
        totalInventoryValue: 0,
        totalProviders: 0,
        totalCategories: 0,
        loading: true,
        error: null,
    };

    let currentTime = new Date();

    async function loadDashboardData() {
        try {
            dashboardData.loading = true;
            const data = await getDashboardData();
            dashboardData = { ...dashboardData, ...data, loading: false };
        } catch (error) {
            dashboardData.error = error.message;
            dashboardData.loading = false;
        }
    }

    onMount(() => {
        loadDashboardData();
        const interval = setInterval(() => {
            currentTime = new Date();
        }, 60000);
        return () => clearInterval(interval);
    });
</script>

<div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p class="text-gray-600">
                {currentTime.toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>

        {#if dashboardData.loading}
            <div class="flex justify-center items-center h-64">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                ></div>
            </div>
        {:else if dashboardData.error}
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div class="flex">
                    <div class="shrink-0">
                        <svg
                            class="h-5 w-5 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            Error al cargar los datos: {dashboardData.error}
                        </p>
                    </div>
                </div>
            </div>
        {:else}
            <!-- Stats Grid - Financial Section -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Finanzas
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Ingresos Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-green-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Ingresos Totales
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {formatCurrency(
                                                dashboardData.totalIngresos,
                                            )}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Egresos Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div class="shrink-0 bg-red-500 rounded-md p-3">
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Egresos Totales
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {formatCurrency(
                                                dashboardData.totalEgresos,
                                            )}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Balance Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-blue-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Balance Actual
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold {dashboardData.balance >=
                                            0
                                                ? 'text-green-600'
                                                : 'text-red-600'}"
                                        >
                                            {formatCurrency(
                                                dashboardData.balance,
                                            )}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid - Inventory Section -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Inventario
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <!-- Total Products Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-purple-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8-4"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Productos
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {dashboardData.totalProducts}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Stock Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-indigo-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Stock Total
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {dashboardData.totalStock}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Low Stock Products Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 {dashboardData.lowStockProducts >
                                    0
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'} rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.535 0l6.364 6.364c1.217 1.217 1.217 3.19 0 4.408L9.879 20.42c-1.217 1.217-3.19 1.217-4.408 0L-1.09 14.056c-1.217-1.217-1.217-3.19 0-4.408L6.343 3.665z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Stock Bajo
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold {dashboardData.lowStockProducts >
                                            0
                                                ? 'text-orange-600'
                                                : 'text-green-600'}"
                                        >
                                            {dashboardData.lowStockProducts}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Inventory Value Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-yellow-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Valor Inventario
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {formatCurrency(
                                                dashboardData.totalInventoryValue,
                                            )}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid - Other Sections -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Configuración
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Providers Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-cyan-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0a2 2 0 100-4 2 2 0 000 4zM9 7h1.05A7.002 7.002 0 009 13"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Proveedores
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {dashboardData.totalProviders}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Categories Card -->
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center">
                                <div
                                    class="shrink-0 bg-pink-500 rounded-md p-3"
                                >
                                    <svg
                                        class="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dt
                                        class="text-sm font-medium text-gray-500 truncate"
                                    >
                                        Categorías
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div
                                            class="text-2xl font-semibold text-gray-900"
                                        >
                                            {dashboardData.totalCategories}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Transactions -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Últimas Transacciones
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Historial de las transacciones más recientes
                    </p>
                </div>
                <div class="bg-white overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Fecha
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Descripción
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Categoría
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Monto
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#if dashboardData.recentTransactions.length === 0}
                                <tr>
                                    <td
                                        colspan="4"
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                    >
                                        No hay transacciones recientes
                                    </td>
                                </tr>
                            {:else}
                                {#each dashboardData.recentTransactions as transaction}
                                    <tr class="hover:bg-gray-50">
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {formatDate(transaction.fecha)}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {transaction.descripcion ||
                                                "Sin descripción"}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {transaction.categoria ||
                                                "Sin categoría"}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium {transaction.ingreso
                                                ? 'text-green-600'
                                                : 'text-red-600'}"
                                        >
                                            {transaction.ingreso ? "+" : "-"}
                                            {formatCurrency(
                                                transaction.monto || 0,
                                            )}
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
                <div
                    class="bg-gray-50 px-4 py-3 text-right text-sm font-medium text-gray-500 sm:px-6"
                >
                    <a
                        href="/admin/balance"
                        class="text-blue-600 hover:text-blue-900"
                    >
                        Ver todas las transacciones →
                    </a>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Add any custom styles here if needed */
</style>
