import React, {useState} from 'react';
import Layout from '../layout/layout';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import {useForm} from 'react-hook-form'
import { HiAtSymbol, HiFingerPrint, HiUser } from "react-icons/hi";
import styles from 'styles/Login.module.css'
import Link from 'next/link';
import Swal from 'sweetalert2';

import Publicas from 'config';

const Register = () => {

    const {data, status} = useSession()
    const router = useRouter()
    if (status !== 'loading' && status === 'authenticated') {
        router.push('/')
    }

    const [errorNextAuth, serErrorNextAuth] = useState('')

    const [show, setshow] = useState({pass: true, Cpass: true});

    const { register, handleSubmit, formState: {errors}, watch, getValues } = useForm()

    const onSubmit = async (data) => {

        const {Cpassword, ...resto} = data

        const response = await fetch(`${Publicas.NEXT_PUBLIC_HOST}/api/usuario`, {
            method: "POST",
            body: JSON.stringify({image: "http://images7.memedroid.com/images/UPLOADED43/5385438d7a708.jpeg", ...resto}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const res = await response.json()

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Te registraste con éxito.',
                timer: 2500
            })
            router.push("/login")
        }else{
            //msj de error
            Swal.fire({
                icon: 'error',
                title: res.msj,
                timer: 2500
            })
            serErrorNextAuth(res.msj)
            // console.log(res.msj)
        }

        // console.log(res)
        // console.log(data.email)

        // if(response.ok){
        //     signIn('email', {
        //         email: data.email,
        //         redirect: false,
        //         callbackUrl: Publicas.NEXT_PUBLIC_HOST,
        //     })
        //     console.log("Si se ejecuta el singIn email")
        //     router.push("/login")
        // }else{
        //     //msj de error
        //     serErrorNextAuth(res.msj)
        //     console.log(res.msj)
        // }

    }

    return (
        <Layout title={"Register"}>

            <div className='flex flex-col items-center'>

                <div>
                    <h1 className="font-semibold mt-6 text-[40px]">Registrarse</h1>
                </div>

                <form className='' onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col items-center w-full">

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Nombre' type={'text'} {...register('name', {required: true})}/>
                            <span className="flex items-center px-4"><HiUser size={25}/></span>
                        </div>

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Apellido' type={'text'} {...register('apellido', {required: true})}/>
                            <span className="flex items-center px-4"><HiUser size={25}/></span>
                        </div>

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='DNI' type={'text'} {...register('DNI', {required: true})}/>
                            <span className="flex items-center px-4"><HiUser size={25}/></span>
                        </div>

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Telefono' type={'text'} {...register('telefono', {required: true})}/>
                            <span className="flex items-center px-4"><HiUser size={25}/></span>
                        </div>

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Direccion' type={'text'} {...register('direccion', {required: true})}/>
                            <span className="flex items-center px-4"><HiUser size={25}/></span>
                        </div>

                        <div className={styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Email' type={'email'} {...register('email', {
                                required: true,
                                pattern: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                                })}/>
                            <span className="flex items-center px-4"><HiAtSymbol size={25}/></span>
                        </div>
                        

                            <div className={styles.input_group}>

                                <input className={`${styles.input_text} bg-slate-50`} placeholder='Contraseña' type={`${show.pass ? 'password' : 'text'}`} {...register('password', {required: true})}/>

                                <span onClick={() => setshow({...show, pass: !show.pass})} className="flex items-center px-4 cursor-pointer"><HiFingerPrint size={25}/></span>
                            </div>

                            <div className={styles.input_group}>

                                <input className={`${styles.input_text} bg-slate-50`} placeholder='Confirmar Contraseña' type={`${show.Cpass ? 'password' : 'text'}`} {...register('Cpassword', {
                                    required: true,
                                    validate: () => {return getValues('password') === getValues('Cpassword') ? true : false}
                                    })}/>

                                <span onClick={() => setshow({...show, Cpass: !show.Cpass})} className="flex items-center px-4 cursor-pointer"><HiFingerPrint size={25}/></span>
                            </div>


                        <input id={styles.btnLogin} className="Saltar cursor-pointer p-1 m-2 w-80 border-2 border-b-slate-300 rounded-[5px] text-[20px]" type={'submit'} value="Register"/>
                    </div>
                </form>

                <p className='mt-2'>Ya tienes una Cuenta? <Link className="text-blue-600" href={'/login'}>Ingresa a login</Link></p>

                <div className="h-10 w-80">
                    <div className='flex flex-col items-center w-80 overflow-hidden pt-0 max-h-[25px] mt-1 absolute  '>
                        {(errors.name?.type === 'required' || errors.password?.type === 'required') && <p className=" text-red-900 ">Complete todos los campos</p>}
                        {(errors.Cpassword?.type === 'validate') && <p className=" text-red-900">La Password no coinciden</p>}
                        {errorNextAuth && <p className=" text-red-900">{errorNextAuth}</p>}
                    </div>
                </div>

            </div>
            
        </Layout>
    );
}

export default Register;
