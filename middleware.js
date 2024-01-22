export  { default } from "next-auth/middleware"

export const config ={
    matcher: ['/dashboard', '/entradas', '/bodegas', '/salidas', '/register', '/perfil', '/stock',  '/clientes', '/bodegas', '/perfil', '/usuarios', '/proveedores', '/forget-password', '/reset-password']
}