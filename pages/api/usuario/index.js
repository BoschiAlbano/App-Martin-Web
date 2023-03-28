import { hash } from 'bcrypt'

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function usuario(req,res){
    
    const {body, method} = req

    switch (method) {
        case "POST":
            
            try {
                
                const user = await prisma.User.findFirst({
                    where: {
                      email: body.email,
                    },
                  });
                
                if (user) {
                    res.status(500).json({msj: 'El Email, Ya estas Registrado'})
                    return
                }

                const hashPass = await hash(body.password, 12)

                // Creamos el user y account
                try {
                    
                    const userId = await prisma.User.create({
                        data: {...body, password: hashPass}
                    })

                    const account = await prisma.Account.create({
                        data: {
                            userId: userId.id,
                            type: "oauth",
                            provider: "credentials",
                            providerAccountId: "123456789"
                        }
                    })

                } catch (error) {
                    throw new Error(`${error.message}`);
                }
                

                return res.status(200).json('Registrado Correctamente')

            } catch (error) {
                return res.status(500).json({msj: error.message})
            }
        default:
            return res.status(500).json("Error, metodo no soportado")
    }
}