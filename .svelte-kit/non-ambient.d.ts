
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/balance" | "/admin/categoria" | "/admin/inventario" | "/admin/proveedores" | "/catalogo" | "/contacto" | "/login" | "/nosotros";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/balance": Record<string, never>;
			"/admin/categoria": Record<string, never>;
			"/admin/inventario": Record<string, never>;
			"/admin/proveedores": Record<string, never>;
			"/catalogo": Record<string, never>;
			"/contacto": Record<string, never>;
			"/login": Record<string, never>;
			"/nosotros": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/balance" | "/admin/balance/" | "/admin/categoria" | "/admin/categoria/" | "/admin/inventario" | "/admin/inventario/" | "/admin/proveedores" | "/admin/proveedores/" | "/catalogo" | "/catalogo/" | "/contacto" | "/contacto/" | "/login" | "/login/" | "/nosotros" | "/nosotros/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/fonts/CascadiaCode-VariableFont_wght.ttf" | "/fonts/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf" | "/fonts/times.ttf" | "/logo-flat.svg" | "/logo.pdf" | "/logo.svg" | "/robots.txt" | string & {};
	}
}