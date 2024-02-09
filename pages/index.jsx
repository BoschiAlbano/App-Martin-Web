import { getSession } from "next-auth/react";
import MenuPaginas from "components/menu/menuPaginas";
import Banner from "components/banner/banner";
import Rubro from "components/rubros/index";
import { useEffect } from "react";
import { useLocalStorage } from "components/prueba/localStorage/hook";
import Swal from "sweetalert2";

import Carousel from "components/Carrucel";
import { useArticuloOferta } from "components/prueba/articulos/hook";

import Spinner from "components/Spinner";
import Link from "next/link";

import prisma from "pirsma";

import { BorrarCookies, eliminarBigIntYDecimal } from "utils/metodos";

export default function Home({ Cliente, Rubros }) {
    const { Nombre, Apellido } = Cliente;
    const [store, setValue] = useLocalStorage("showWelcome", true);

    const [getOfertas, resultOfertas] = useArticuloOferta();

    console.log(Rubros);

    useEffect(() => {
        getOfertas({
            variables: { medicamento: Cliente.Persona_Cliente.Medicamento },
        });

        if (store) {
            Swal.fire({
                icon: "info",
                title: "Distrinova",
                html: `Hola ${Nombre} ${Apellido} !!! Bienvenido a nuestra pagina web.`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.hideLoading();
                },
            });

            setValue(false);
        }
    }, []);

    return (
        <div>
            <MenuPaginas>
                <div className="Degradado_Banner h-full">
                    <Banner />
                    {/* {
            medicamento ? <Rubro medicamento={true}/> : <Rubro medicamento={false}/>
          } */}
                    {/* <Rubro medicamento={medicamento} /> */}

                    <div className="flex sm:flex-col-reverse flex-col mt-5">
                        {resultOfertas.data ? (
                            <Carousel
                                products={
                                    resultOfertas.data.GET_Articulos_Oferta
                                }
                            />
                        ) : (
                            <div className="w-full flex flex-col items-center mt-3">
                                {" "}
                                <Spinner />
                            </div>
                        )}

                        <section>
                            {/* <h1 className="text-center sm:text-[3rem] text-[1.5rem] font-[merienda] my-3">Conoce nuestros rubros</h1> */}

                            <div className="flex w-full sm:w-auto sm:h-auto flex-row flex-wrap gap-3 sm:gap-5 justify-center items-center mt-3 mb-10">
                                {Rubros.map((item, index) => (
                                    <Link
                                        className="button p-2 border-black rounded-xl border-[4px]"
                                        href={`articulos/${item.Id}/${item.Descripcion}`}
                                        key={index}
                                    >
                                        {item.Descripcion}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </MenuPaginas>
        </div>
    );
}

export async function getServerSideProps(context) {
    //#region Session
    console.log("Entra cuantas");
    const session = await getSession(context);

    if (!session) {
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    console.log(session.user);

    if (session?.error) {
        console.log(session.error);
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    //#endregion

    const Mail = session.user.email;
    //#region Obtener todos los datos del usuario y pasarlos por props
    const cliente = await prisma.persona.findFirst({
        where: {
            Mail,
        },
        include: { Persona_Cliente: true },
    });

    if (cliente == null) {
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    console.log(cliente);

    //#endregion

    //#region Obtener todos los datos del rubros y pasarlos por props dependiendo el cliente por Medicamentos.
    const Rubros = await prisma.rubro.findMany({
        where: {
            EstaEliminado: false,
            Descripcion: cliente.Persona_Cliente.Medicamento
                ? { notIn: ["Indefinido"] }
                : { notIn: ["Medicamentos", "Indefinido"] },
        },
        // include: {
        //     Articulo: true,
        // },
    });
    console.log(Rubros);

    //#endregion

    return {
        props: {
            Cliente: eliminarBigIntYDecimal(cliente),
            Rubros: eliminarBigIntYDecimal(Rubros),
        },
    };
}

//#region GET User
//   const query = `
// query GetUser($email: String!) {
//   GetUser(email: $email) {
//     id
//     name
//     apellido
//     DNI
//     telefono
//     direccion
//     medicamento
//   }
// }
// `;

//   const variables = {
//       email: session.user.email,
//   };

//   const data = await request(
//       `${process.env.NEXTAUTH_URL}/api/graphql`,
//       query,
//       variables
//   );

//   if (!data.GetUser) {
//       context.res.setHeader("Set-Cookie", [
//           "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
//           "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
//           "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
//           // Agrega más sentencias 'Set-Cookie' para cada cookie que desees borrar
//       ]);

//       return {
//           redirect: {
//               destination: "/login",
//               permanent: false,
//           },
//       };
//   }
//#endregion

//#region Get Rubros
//   const query2 = `
//   query GetUser($medicamento: Boolean!) {
//     GET_Rubro(Medicamento: $medicamento) {
//         Id
//         Codigo
//         Descripcion
//         EstaEliminado
//     }
//     }
// `;

//   const variables2 = {
//       medicamento: data.GetUser.medicamento,
//   };

//   const data2 = await request(
//       `${process.env.NEXTAUTH_URL}/api/graphql`,
//       query2,
//       variables2
//   );

//   console.log(data2.GET_Rubro);

//#endregion
