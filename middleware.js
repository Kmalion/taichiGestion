export  { default } from "next-auth/middleware"

export const config ={
    matcher: ['/dashboard', '/entradas', '/bodegas', '/salidas', '/perfil', '/stock', '/historial', '/register']
}