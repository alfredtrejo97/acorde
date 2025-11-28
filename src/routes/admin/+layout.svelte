<script>
    import "../../app.css";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";

    let loading = true;
    let user = null;
    let mobileMenuOpen = false;
    let userDropdownOpen = false;

    function toggleMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    // Click outside directive
    function clickOutside(node, callback) {
        const handleClick = (event) => {
            if (
                node &&
                !node.contains(event.target) &&
                !event.defaultPrevented
            ) {
                callback();
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            },
        };
    }

    onMount(() => {
        onAuthStateChanged(auth, (u) => {
            user = u;
            loading = false;
            if (!user) window.location.href = "/login";
        });
    });
</script>

<nav class="bg-stone-950 text-stone-50 px-4 py-2">
    <div class="flex justify-between items-center">
        <!-- Logo / Volver -->
        <a
            href="/"
            class="flex gap-2 items-center text-md hover:text-gray-300 transition"
        >
            <i class="fa-solid fa-arrow-left"></i>
            <h1>Visitar Sitio</h1>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
            <a
                href="/admin"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-chart-line"></i><span>PANEL</span>
            </a>
            <a
                href="/admin/categoria"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-box"></i>CATEGORIAS
            </a>
            <a
                href="/admin/proveedores"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-truck"></i><span>PROVEEDORES</span>
            </a>
            <a
                href="/admin/inventario"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-box"></i><span>INVENTARIO</span>
            </a>
            <a
                href="/admin/balance"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-balance-scale"></i><span>BALANCE</span>
            </a>

            <!-- User Dropdown -->
            <div class="relative ml-4">
                <button
                    class="flex items-center gap-2 hover:text-gray-300"
                    on:click={() => (userDropdownOpen = !userDropdownOpen)}
                >
                    <i class="fa-solid fa-user"></i>
                    <span class="truncate max-w-[150px]"
                        >{user?.email || "Usuario"}</span
                    >
                    <i class="fa-solid fa-chevron-down text-xs opacity-70"></i>
                </button>
                {#if userDropdownOpen}
                    <div
                        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        use:clickOutside={() => (userDropdownOpen = false)}
                    >
                        <button
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            on:click={async () => {
                                try {
                                    await auth.signOut();
                                    window.location.href = "/login";
                                } catch (error) {
                                    console.error(
                                        "Error al cerrar sesión:",
                                        error,
                                    );
                                    window.location.href = "/login";
                                }
                            }}
                        >
                            <i class="fa-solid fa-arrow-right-from-bracket mr-2"
                            ></i> Cerrar sesión
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Hamburger -->
        <button
            class="md:hidden text-2xl hover:text-gray-300 transition"
            on:click={toggleMenu}
        >
            {#if mobileMenuOpen}
                <i class="fa-solid fa-xmark"></i>
            {:else}
                <i class="fa-solid fa-bars"></i>
            {/if}
        </button>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
        <div
            class="md:hidden mt-3 flex flex-col gap-3 bg-stone-900 p-4 rounded-lg animate-fadeIn"
        >
            <a
                href="/admin"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-chart-line"></i>PANEL
            </a>
            <a
                href="/admin/categorias"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-box"></i>CATEGORIAS
            </a>
            <a
                href="/admin/proveedores"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-truck"></i>PROVEEDORES
            </a>
            <a
                href="/admin/inventario"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-box"></i>INVENTARIO
            </a>
            <a
                href="/admin/balance"
                class="flex gap-2 items-center hover:text-gray-300"
            >
                <i class="fa-solid fa-balance-scale"></i>BALANCE
            </a>

            <!-- Mobile User Info -->
            <div
                class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700"
            >
                <i class="fa-solid fa-user"></i>
                <span class="truncate">{user?.email || "Usuario"}</span>
                <button
                    class="ml-auto text-sm text-gray-300 hover:text-white flex items-center"
                    on:click={async () => {
                        try {
                            await auth.signOut();
                            window.location.href = "/login";
                        } catch (error) {
                            console.error("Error al cerrar sesión:", error);
                            window.location.href = "/login";
                        }
                    }}
                >
                    <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> Salir
                </button>
            </div>
        </div>
    {/if}
</nav>

{#if loading}
    <p>Validando sesión...</p>
{:else if user}
    <slot />
{/if}
a

<style>
    /* Suave aparición del menú móvil */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fadeIn {
        animation: fadeIn 0.18s ease-out;
    }
</style>
