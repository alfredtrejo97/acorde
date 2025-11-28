<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/assets/js/firebase/firebase";
    import {
        signInWithEmailAndPassword,
        onAuthStateChanged,
    } from "firebase/auth";

    let email = "";
    let password = "";
    let loading = false;
    let error = "";

    function goToAdmin() {
        window.location.href = "/admin";
    }

    onMount(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                goToAdmin();
            }
        });
        return () => unsub();
    });

    async function handleSubmit(event) {
        event.preventDefault();
        loading = true;
        error = "";

        try {
            await signInWithEmailAndPassword(auth, email, password);
            goToAdmin();
        } catch (e) {
            console.error(e);
            error = "Correo o contraseña incorrectos";
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <div class="login-card">
        <h1>Iniciar sesión</h1>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <form on:submit={handleSubmit} class="login-form">
            <label>
                Correo electrónico
                <input
                    type="email"
                    bind:value={email}
                    placeholder="tu@correo.com"
                    required
                />
            </label>
            <label>
                Contraseña
                <input
                    type="password"
                    bind:value={password}
                    placeholder="********"
                    required
                />
            </label>
            <button type="submit" disabled={loading}>
                {#if loading}
                    Iniciando sesión...
                {:else}
                    Entrar
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0b0b0b;
    }

    .login-card {
        background: #111827;
        color: #f9fafb;
        padding: 2rem;
        border-radius: 0.75rem;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    input {
        padding: 0.55rem 0.75rem;
        border-radius: 0.375rem;
        border: 1px solid #4b5563;
        background: #030712;
        color: #f9fafb;
        font-size: 0.9rem;
    }

    input:focus {
        outline: none;
        border-color: #fbbf24;
        box-shadow: 0 0 0 1px #fbbf24;
    }

    button {
        margin-top: 0.5rem;
        width: 100%;
        padding: 0.65rem;
        border-radius: 0.375rem;
        border: none;
        background: #fbbf24;
        color: #111827;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease-in-out;
    }

    button:disabled {
        opacity: 0.7;
        cursor: default;
    }

    button:not(:disabled):hover {
        background: #f59e0b;
    }

    .error {
        color: #fca5a5;
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
        text-align: center;
    }
</style>
