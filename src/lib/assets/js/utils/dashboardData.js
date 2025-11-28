import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/assets/js/firebase/firebase';

export async function getDashboardData() {
    try {
        // Fetch balance data
        const balanceRef = collection(db, 'balance');
        const balanceQuery = query(balanceRef, orderBy('fecha', 'desc'));
        const balanceSnapshot = await getDocs(balanceQuery);

        let totalIngresos = 0;
        let totalEgresos = 0;
        const recentTransactions = [];

        balanceSnapshot.forEach((doc) => {
            const data = doc.data();
            const monto = data.monto || 0;

            if (data.ingreso) {
                totalIngresos += monto;
            } else {
                totalEgresos += monto;
            }

            if (recentTransactions.length < 5) {
                recentTransactions.push({
                    id: doc.id,
                    ...data,
                    fecha: data.fecha?.toDate() || new Date(),
                });
            }
        });

        const balance = totalIngresos - totalEgresos;

        // Fetch inventory data
        const inventarioRef = collection(db, 'inventario');
        const inventarioSnapshot = await getDocs(inventarioRef);

        let totalProducts = 0;
        let totalStock = 0;
        let lowStockProducts = 0;
        let totalInventoryValue = 0;

        inventarioSnapshot.forEach((doc) => {
            const data = doc.data();
            totalProducts++;
            const stock = Number(data.Stock) || 0;
            const precioCompra = Number(data.PrecioCompra) || 0;

            totalStock += stock;
            totalInventoryValue += stock * precioCompra;

            if (stock <= 5) {
                lowStockProducts++;
            }
        });

        // Fetch providers data
        const proveedoresRef = collection(db, 'proveedores');
        const proveedoresSnapshot = await getDocs(proveedoresRef);
        let totalProviders = proveedoresSnapshot.size;

        // Fetch categories data
        const categoriasRef = collection(db, 'categorias');
        const categoriasSnapshot = await getDocs(categoriasRef);
        let totalCategories = categoriasSnapshot.size;

        return {
            // Financial data
            totalIngresos,
            totalEgresos,
            balance,
            recentTransactions,

            // Inventory data
            totalProducts,
            totalStock,
            lowStockProducts,
            totalInventoryValue,

            // Other data
            totalProviders,
            totalCategories,

            lastUpdated: new Date()
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return {
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
            lastUpdated: new Date(),
            error: error.message
        };
    }
}

// Format currency in COP
export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}