export default async function datos(req,res){
    
    // const session = await getSession({req})

    // if (!session) {
    //     return res.status(403).send('Primero inicie Sesion')
    // }

    res.status(200).json("Api de Prueba, No Base de datos, No usuario")
}


