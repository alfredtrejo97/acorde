<script>
    let features = [
        {
            title: "Calidad Premium",
            description:
                "Todos nuestros productos son seleccionados cuidadosamente para garantizar la mejor calidad.",
        },
        {
            title: "Entrega Rápida",
            description:
                "Procesamos y enviamos tus pedidos con la mayor rapidez posible.",
        },
        {
            title: "Soporte 24/7",
            description:
                "Nuestro equipo está disponible para resolver tus dudas en cualquier momento.",
        },
    ];
</script>

<svelte:head>
    <title>Acorde - Inicio</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-gray-50/50 to-gray-100/50">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 class="font-times text-5xl md:text-6xl text-black mb-6">
                    Bienvenido a Acorde
                </h1>
                <p
                    class="font-roboto-flex text-lg text-black mb-8 leading-relaxed"
                >
                    Descubre nuestra colección exclusiva de productos de alta
                    calidad. Somos tu aliado en la búsqueda de excelencia y
                    estilo.
                </p>
                <div class="flex gap-4">
                    <a
                        href="/catalogo"
                        class="font-cascadia bg-black text-white px-8 py-3 rounded-lg hover:bg-slate-900 transition"
                    >
                        Catálogo
                    </a>
                    <a
                        href="/contacto"
                        class="font-cascadia border-2 border-black text-black px-8 py-3 rounded-lg hover:bg-slate-50 transition"
                    >
                        Contactanos
                    </a>
                </div>
            </div>
            <div
                class="rounded-lg h-96 flex items-center justify-center overflow-hidden"
            >
                <img
                    src="https://cosmeticosenlinea.com/cdn/shop/articles/Mejores_perfumes_para_hombre_las_recomendaciones_mas_top_y_economicas_en_fragancias_masculinas.jpg?v=1716414953&width=1500"
                    alt=""
                    class="w-full h-full object-cover"
                />
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="bg-white py-20">
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="font-times text-4xl text-center text-black mb-16">
                ¿Por qué elegirnos?
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                {#each features as feature}
                    <div
                        class="p-8 border border-slate-200 rounded-lg hover:shadow-lg transition"
                    >
                        <div
                            class="flex items-center justify-evenly font-times text-3xl text-slate-900 mb-4"
                        >
                            <h3 class="font-times text-3xl text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                        </div>
                        <p class="font-roboto-flex text-slate-600 text-center">
                            {feature.description}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-black text-white py-16">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="font-times text-4xl mb-6 text-white uppercase">
                ¿Listo para comenzar?
            </h2>
            <p class="font-roboto-flex text-xl mb-8 text-white">
                Explora nuestro catálogo y encuentra exactamente lo que buscas.
            </p>
            <a
                href="/catalogo"
                class="font-cascadia inline-block bg-white text-black px-8 py-3 rounded-lg hover:bg-slate-100 transition font-semibold"
            >
                Catálogo
            </a>
        </div>
    </section>
</div>
