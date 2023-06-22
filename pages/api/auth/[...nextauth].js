import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email";

import nodemailer from "nodemailer"
import {html, text} from "utils/htmlEmail"

import bcrypt from 'bcrypt'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password"
        },
      },
      async authorize(credentials) {

        const email = credentials.email;
        const password = credentials.password;
        // Comprobar si existe el usuario
        try {

          const Usuario = await prisma.User.findFirst({
            where: {
              email,
            },
          });

          // si existe el mail
          if (!Usuario) {
            throw new Error('No Estas Registrado.');
          }
          // si no hay contraseña esta registrado con otro providers
          if(!Usuario.password){
            throw new Error("Email Registrado con google o github.");
          }
          // Compara las contraseñas
          const isMatch = await bcrypt.compare(password, Usuario.password)
          if(!isMatch){
            throw new Error("Contraseña no es valida.");
          }
          // Email
          // if(Usuario.emailVerified === null){
          //   throw new Error("Verifica el Email.");
          // }

          return Usuario;

        } catch (error) {
          throw new Error(`${error.message}`);
        }
      }
      
    }),
    EmailProvider({
      // https://www.google.com/settings/security/lesssecureapps
      // https://myaccount.google.com/
      // AppMartinWeb: ygwejxovsofffbfp
      // smtp://iprogramacion17@gmail.com:ygwejxovsofffbfp@smtp.gmail.com:587
      server: process.env.EMAIL_SERVER_HOST,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest ({
        identifier: email,
        url,
        provider: { server, from }
      }){
        const { host } = new URL(url)
        const transport = nodemailer.createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // database: process.env.MONGODB_URI,
  session: {strategy: 'jwt'},
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
})

/*ERROR*/
    /* El Email se puede registrar so una ves con cualquir proveedor*/