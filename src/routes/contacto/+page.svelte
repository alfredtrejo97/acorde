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
                                <i class="fas fa-map-marker-alt"></i>
                                Dirección
                            </h4>
                            <p class="font-roboto-flex text-slate-600">
                                Carrera 23 #14-38 Calle del colorado<br />
                                Pasto, Nariño<br />
                                Colombia
                            </p>
                        </div>

                        <div class="mb-8 flex flex-col">
                            <a
                                href="mailto:acordeadmon1997@gmail.com"
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                <i class="fas fa-envelope"></i>
                                Correo Electrónico
                            </a>
                            <a
                                href="https://www.instagram.com/acorde___/"
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                <i class="fab fa-instagram"></i>
                                Instagram
                            </a>
                            <a
                                href="https://www.tiktok.com/@alfredtrejo"
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                <i class="fab fa-tiktok"></i>
                                TikTok
                            </a>
                        </div>

                        <div class="mb-8">
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-2"
                            >
                                <i class="fas fa-phone"></i>
                                Teléfono
                            </h4>
                            <p class="font-roboto-flex text-slate-600">
                                (+57) 319 508 7461
                            </p>
                        </div>

                        <div>
                            <h4
                                class="font-roboto-flex font-semibold text-slate-900 mb-4"
                            >
                                <i class="fas fa-clock"></i>
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
                class="bg-slate-300 rounded-lg h-96 flex items-center justify-center border border-slate-400"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9261031860315!2d-77.2838222261476!3d1.2117260620065866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed483677c6d13%3A0xdd58dc3ca3bd815b!2sCra.%2023%20%2314-38%2C%20Pasto%2C%20Nari%C3%B1o!5e0!3m2!1ses-419!2sco!4v1771459195539!5m2!1ses-419!2sco"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    class="w-full h-full rounded-lg"
                    title="Ubicación de Acorde Perfumería"
                ></iframe>
            </div>
        </div>
    </section>
</div>
