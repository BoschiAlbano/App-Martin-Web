import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import nodemailer from "nodemailer";
import { html, text } from "utils/htmlEmail";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient()

import prisma from "pirsma";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "text",
                },
                password: {
                    label: "password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const email = credentials.email;
                const password = credentials.password;
                try {
                    const _Persona = await prisma.persona.findFirst({
                        where: {
                            Mail: email,
                        },
                        include: {
                            Persona_Cliente: true,
                            Persona_Empleado: {
                                select: { Foto: false, Id: true, Legajo: true },
                            },
                        },
                    });

                    // si existe el mail
                    if (!_Persona) {
                        throw new Error("No Estas Registrado.");
                    }

                    console.log(_Persona);
                    // Si es Cliente sistema o web
                    // ConsumidorFinal = 0,
                    // Sistema = 1,
                    // Web = 2,
                    // Preventista = 3,

                    if (
                        !_Persona.Persona_Cliente &&
                        !_Persona.Persona_Empleado
                    ) {
                        throw new Error("Error, No es Empleado ni Cliente");
                    }

                    if (_Persona.Roll === 3) {
                        await Preventista(_Persona, password);
                    } else {
                        await Cliente(_Persona, password);
                    }

                    return {
                        name: _Persona.Nombre,
                        email: _Persona.Mail,
                        image: "",
                    };
                } catch (error) {
                    throw new Error(`${error.message}`);
                }
            },
        }),
        EmailProvider({
            // https://www.google.com/settings/security/lesssecureapps
            // https://myaccount.google.com/
            // AppMartinWeb: ygwejxovsofffbfp
            // smtp://iprogramacion17@gmail.com:ygwejxovsofffbfp@smtp.gmail.com:587
            server: process.env.EMAIL_SERVER_HOST,
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({
                identifier: email,
                url,
                provider: { server, from },
            }) {
                const { host } = new URL(url);
                const transport = nodemailer.createTransport(server);
                await transport.sendMail({
                    to: email,
                    from,
                    subject: `Sign in to ${host}`,
                    text: text({ url, host }),
                    html: html({ url, host, email }),
                });
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    // database: process.env.MONGODB_URI,
    session: {
        maxAge: 28800, // 3600 - 1 hora - 8hs
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
});

function Cliente(_Persona, password) {
    // Cliente 2
    if (_Persona.Roll !== 2) {
        throw new Error("Error, Cliente no esta autorizado por el sistema...");
    }

    if (password !== _Persona.Persona_Cliente.Password) {
        throw new Error("Contraseña no es valida.");
    }
}

async function Preventista(_Persona, password) {
    // buscar el usuario - password
    const _usuario = await prisma.usuario.findFirst({
        where: {
            EmpleadoId: _Persona.Id,
        },
    });

    if (!_usuario) {
        throw new Error("Erro, el empleado/preventista no tiene usuario");
    }

    console.log(password);
    console.log(_usuario.Password);

    if (password !== _usuario.Password) {
        console.log("mal");
        throw new Error("Contraseña no es valida.");
    }
}
