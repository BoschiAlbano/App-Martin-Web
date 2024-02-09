import { hash } from "bcrypt";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient()

import prisma from "pirsma";

export default async function usuario(req, res) {
    const { body, method } = req;

    console.log(body);

    switch (method) {
        case "POST":
            try {
                const user = await prisma.persona.findFirst({
                    where: {
                        Mail: body.email,
                    },
                });

                if (user) {
                    res.status(500).json({
                        msj: "El Email, Ya estas Registrado",
                    });
                    return;
                }

                const hashPass = await hash(body.password, 12);

                // Creamos el cliente y Persona_Cliente / account
                try {
                    const userId = await prisma.persona.create({
                        // data: {...body, password: hashPass, medicamento: false}
                        data: {
                            Apellido: body.apellido,
                            Nombre: body.nombre,
                            Dni: body.DNI,
                            Direccion: body.direccion,
                            Telefono: body.telefono,
                            Mail: body.email,
                            LocalidadId: 1,
                            EstaEliminado: false,
                            Roll: 2,
                        },
                    });

                    const presonClient = await prisma.persona_Cliente.create({
                        data: {
                            Id: userId.Id,
                            ActivarCtaCte: true,
                            TieneLimiteCompra: false,
                            MontoMaximoCtaCte: 0,
                            Deuda: 0,
                            Medicamento: false,
                            Password: hashPass,
                        },
                    });

                    // const account = await prisma.Account.create({
                    //     data: {
                    //         userId: userId.Id,
                    //         type: "oauth",
                    //         provider: `credentials ${userId.Mail}`,
                    //         providerAccountId: `provider ${userId.Mail}`,
                    //     },
                    // });
                } catch (error) {
                    throw new Error(`${error.message}`);
                }

                return res.status(200).json("Registrado Correctamente");
            } catch (error) {
                return res.status(500).json({ msj: error.message });
            }
        default:
            return res.status(500).json("Error, metodo no soportado");
    }
}
