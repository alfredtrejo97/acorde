<svelte:head>
    <title>Acorde - Nosotros</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200 py-12">
        <div class="max-w-7xl mx-auto px-6">
            <h1 class="font-times text-5xl font-bold text-slate-900 mb-4">
                Sobre Nosotros
            </h1>
            <p class="font-roboto-flex text-lg text-slate-600">
                Conoce la historia y valores que nos definen
            </p>
        </div>
    </section>

    <!-- Story Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div
                    class="bg-slate-300 rounded-lg h-96 flex items-center justify-center"
                >
                    <p class="font-cascadia text-slate-600">Nuestra Historia</p>
                </div>
                <div>
                    <h2
                        class="font-times text-4xl font-bold text-slate-900 mb-6"
                    >
                        Nuestra Historia
                    </h2>
                    <p
                        class="font-roboto-flex text-slate-600 mb-4 leading-relaxed"
                    >
                        Acorde nació con la visión de ofrecer productos de
                        calidad excepcional a nuestros clientes. Desde nuestros
                        inicios, nos hemos comprometido con la excelencia en
                        cada aspecto de nuestro negocio.
                    </p>
                    <p
                        class="font-roboto-flex text-slate-600 mb-4 leading-relaxed"
                    >
                        Con más de una década de experiencia, hemos construido
                        una reputación sólida basada en la confianza, la calidad
                        y el servicio al cliente. Cada producto que ofrecemos es
                        cuidadosamente seleccionado para garantizar la
                        satisfacción de nuestros clientes.
                    </p>
                    <p class="font-roboto-flex text-slate-600 leading-relaxed">
                        Hoy en día, continuamos innovando y mejorando nuestros
                        servicios para brindar la mejor experiencia posible a
                        nuestros clientes.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Values Section -->
    <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-6">
            <h2
                class="font-times text-4xl font-bold text-center text-slate-900 mb-16"
            >
                Nuestros Valores
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="p-8 border-l-4 border-slate-900">
                    <h3
                        class="font-roboto-flex text-2xl font-bold text-slate-900 mb-4"
                    >
                        Integridad
                    </h3>
                    <p class="font-roboto-flex text-slate-600 leading-relaxed">
                        Actuamos con honestidad y transparencia en todas
                        nuestras operaciones, manteniendo los más altos
                        estándares éticos.
                    </p>
                </div>
                <div class="p-8 border-l-4 border-slate-900">
                    <h3
                        class="font-roboto-flex text-2xl font-bold text-slate-900 mb-4"
                    >
                        Excelencia
                    </h3>
                    <p class="font-roboto-flex text-slate-600 leading-relaxed">
                        Nos esforzamos constantemente por mejorar y ofrecer lo
                        mejor en calidad, servicio y atención al cliente.
                    </p>
                </div>
                <div class="p-8 border-l-4 border-slate-900">
                    <h3
                        class="font-roboto-flex text-2xl font-bold text-slate-900 mb-4"
                    >
                        Innovación
                    </h3>
                    <p class="font-roboto-flex text-slate-600 leading-relaxed">
                        Buscamos constantemente nuevas formas de mejorar
                        nuestros productos y servicios para satisfacer las
                        necesidades cambiantes de nuestros clientes.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
            <h2
                class="font-times text-4xl font-bold text-center text-slate-900 mb-16"
            >
                Nuestro Equipo
            </h2>
            <div class="grid md:grid-cols-4 gap-8">
                {#each Array(4) as _, i}
                    <div class="text-center">
                        <div
                            class="bg-slate-300 rounded-full h-40 w-40 mx-auto mb-4 flex items-center justify-center"
                        >
                            <p class="font-cascadia text-slate-600">
                                Miembro {i + 1}
                            </p>
                        </div>
                        <h3
                            class="font-roboto-flex font-bold text-slate-900 mb-2"
                        >
                            Nombre Miembro {i + 1}
                        </h3>
                        <p class="font-roboto-flex text-sm text-slate-600">
                            Posición / Rol
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-slate-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-4 gap-8 text-center">
                <div>
                    <p class="font-times text-5xl font-bold mb-2">10+</p>
                    <p class="font-roboto-flex text-slate-300">
                        Años de Experiencia
                    </p>
                </div>
                <div>
                    <p class="font-times text-5xl font-bold mb-2">5000+</p>
                    <p class="font-roboto-flex text-slate-300">
                        Clientes Satisfechos
                    </p>
                </div>
                <div>
                    <p class="font-times text-5xl font-bold mb-2">500+</p>
                    <p class="font-roboto-flex text-slate-300">Productos</p>
                </div>
                <div>
                    <p class="font-times text-5xl font-bold mb-2">24/7</p>
                    <p class="font-roboto-flex text-slate-300">
                        Soporte Disponible
                    </p>
                </div>
            </div>
        </div>
    </section>
</div>
