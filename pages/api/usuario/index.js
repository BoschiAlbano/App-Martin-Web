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

                // Encriptar en js y desencriptar en c# (Proximamente) 😭
                const hashPass = body.password;

                // Traer el primer legajo (1° empleado "Martin")
                const empleado = await prisma.persona_Empleado.findFirst();

                if (!empleado) {
                    res.status(500).json({
                        msj: "Error, no te puedes registrar, no hay empleados en el sistema",
                    });
                    return;
                }

                try {
                    const _Trans = await prisma.$transaction(async (prisma) => {
                        const userId = await prisma.persona.create({
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

                        const presonClient =
                            await prisma.persona_Cliente.create({
                                data: {
                                    Id: userId.Id,
                                    ActivarCtaCte: true,
                                    TieneLimiteCompra: false,
                                    MontoMaximoCtaCte: 0,
                                    Deuda: 0,
                                    Medicamento: false,
                                    Password: hashPass,
                                    EmpleadoLegajo: empleado.Legajo, // Este es el legajo 1 del 1° empleado sistema martin
                                },
                            });
                    });
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
