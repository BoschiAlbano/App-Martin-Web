import { getSession } from 'next-auth/react'

import connectDBmongoose from "lib/mongoose"
import UsersApp from 'models/userModel'

export default async function datos(req,res){
    
    // const session = await getSession({req})

    // if (!session) {
    //     return res.status(403).send('Primero inicie Sesion')
    // }

    await connectDBmongoose();
    
    const user = await UsersApp.find()
    const session = {datos: user, msj: "Esto son los datos de la base de datos para probrar"}

    res.status(200).json(session)
}


