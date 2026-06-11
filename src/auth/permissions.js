export const permissions = {
    admin: ["dashboard", "cadastros", "clientes", "lotes", "compras", "vendas"],
    comercial: ["dashboard", "cadastros", "clientes", "lotes", "compras", "vendas"],
    operacional: ["dashboard", "cadastros", "lotes", "safras", "origens", "variedades"],
    consulta: ["dashboard"],
};

export function hasPermission(user, permission) {
    if (!user) return false;

    return permissions[user.role]?.includes(permission);
}