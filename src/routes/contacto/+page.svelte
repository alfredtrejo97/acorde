<script>
    let formData = $state({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
    });

    let submitted = $state(false);

    function handleSubmit(e) {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log("Formulario enviado:", formData);
        submitted = true;
        setTimeout(() => {
            submitted = false;
            formData = { nombre: "", email: "", asunto: "", mensaje: "" };
        }, 3000);
    }
</script>

<svelte:head>
    <title>Acorde - Contacto</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200 py-12">
        <div class="max-w-7xl mx-auto px-6">
            <h1 class="font-times text-5xl font-bold text-slate-900 mb-4">
                Contactanos
            </h1>
            <p class="font-roboto-flex text-lg text-slate-600">
                Estamos aquí para ayudarte. Envíanos un mensaje y nos pondremos
                en contacto pronto.
            </p>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-3 gap-12">
                <!-- Contact Info -->
                <div class="md:col-span-1">
                    <div class="bg-white p-8 rounded-lg shadow">
                        <h3
                            class="font-roboto-flex font-bold text-slate-900 mb-6 text-xl"
                        >
                            Información de Contacto
                        </h3>

                        <div class="mb-8">
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                📍 Dirección
                            </h4>
                            <p class="font-roboto-flex text-slate-600">
                                Calle Principal 123<br />
                                Pasto, Nariño<br />
                                Colombia
                            </p>
                        </div>

                        <div class="mb-8">
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                📞 Teléfono
                            </h4>
                            <p class="font-roboto-flex text-slate-600">
                                (+57) 319 508 7461
                            </p>
                        </div>

                        <div class="mb-8">
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                ✉️ Email
                            </h4>
                            <p class="font-roboto-flex text-slate-600">
                                acordeadmon1997@gmail.com
                            </p>
                        </div>

                        <div>
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-4"
                            >
                                Horario de Atención
                            </h4>
                            <p class="font-roboto-flex text-slate-600 mb-2">
                                Lunes - Viernes: 9:30 AM - 7:00 PM
                            </p>
                            <p class="font-roboto-flex text-slate-600">
                                Domingo: Cerrado
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="md:col-span-2">
                    <div class="bg-white p-8 rounded-lg shadow">
                        <h3
                            class="font-roboto-flex font-bold text-slate-900 mb-6 text-xl"
                        >
                            Envíanos un Mensaje
                        </h3>

                        {#if submitted}
                            <div
                                class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                            >
                                <p class="font-roboto-flex text-green-700">
                                    ✓ ¡Mensaje enviado exitosamente! Nos
                                    pondremos en contacto pronto.
                                </p>
                            </div>
                        {/if}

                        <form onsubmit={handleSubmit} class="space-y-6">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        for="nombre"
                                        class="font-roboto-flex block text-sm font-semibold text-slate-900 mb-2"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        bind:value={formData.nombre}
                                        required
                                        class="font-roboto-flex w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="email"
                                        class="font-roboto-flex block text-sm font-semibold text-slate-900 mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        bind:value={formData.email}
                                        required
                                        class="font-roboto-flex w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    for="asunto"
                                    class="font-roboto-flex block text-sm font-semibold text-slate-900 mb-2"
                                >
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    id="asunto"
                                    bind:value={formData.asunto}
                                    required
                                    class="font-roboto-flex w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="Asunto del mensaje"
                                />
                            </div>

                            <div>
                                <label
                                    for="mensaje"
                                    class="font-roboto-flex block text-sm font-semibold text-slate-900 mb-2"
                                >
                                    Mensaje
                                </label>
                                <textarea
                                    id="mensaje"
                                    bind:value={formData.mensaje}
                                    required
                                    rows="6"
                                    class="font-roboto-flex w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="Tu mensaje aquí..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                class="font-roboto-flex w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition font-semibold"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="bg-white py-16 border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-6">
            <h2
                class="font-times text-4xl font-bold text-center text-slate-900 mb-12"
            >
                Ubicación
            </h2>
            <div
                class="bg-slate-300 rounded-lg h-96 flex items-center justify-center"
            >
                <p class="font-cascadia text-slate-600">
                    Mapa interactivo aquí
                </p>
            </div>
        </div>
    </section>
</div>
