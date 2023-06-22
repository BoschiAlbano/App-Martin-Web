import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Layout from '../layout/layout';
import {useForm} from 'react-hook-form'
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import styles from 'styles/Login.module.css'
import Link from 'next/link';
import Swal from 'sweetalert2';

import Publicas from 'config';

export default function Login () {

    const router = useRouter()
    const [show, setshow] = useState(true);
    const [errorNextAuth, serErrorNextAuth] = useState('')

    const { register, handleSubmit, formState: {errors}, watch, getValues } = useForm()

    /*[Logiado]*/
    const {data, status} = useSession()

    if (status !== 'loading' && status === 'authenticated') {
        router.push('/')
    }
    
    const ErrorUrl = router.asPath.slice(-21,router.asPath.length)
    
    useEffect(() => {
        if(ErrorUrl == 'OAuthAccountNotLinked'){
        serErrorNextAuth('El Email requiere contraseña')
    }
    }, [ErrorUrl]);

    const onSubmit = async (data) => {

        signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
            callbackUrl: Publicas.NEXT_PUBLIC_HOST,
        }).then(response => {
            // console.log(response)

            if (!response.ok) {
                // console.log(response.error)
                Swal.fire({
                    icon: 'error',
                    title: response.error,
                    timer: 2500
                })
                serErrorNextAuth(response.error)
            }
            
        }).catch(error => {
            console.log(error.message)
            Swal.fire({
                icon: 'error',
                title: response.error,
                timer: 2500
            })
            serErrorNextAuth(error.message)
        })
    }
    const ReenviarCorreo = () => {
        // signIn('email', {
        //     email: getValues('email'),
        //     redirect: false,
        //     callbackUrl: Publicas.NEXT_PUBLIC_HOST,
        // })
        // alert('Correo Reenviado, verifique su Email')
    }

    return (
        <Layout title={"Login"}>

            <div className='flex flex-col items-center'>
                <div>
                    <h1 className="font-semibold  mt-6 text-[40px]">Ingresar</h1>
                </div>

                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col items-center w-full">

                        <div className={errorNextAuth ? styles.input_group_Error : styles.input_group}>
                            <input className={`${styles.input_text} bg-slate-50`} placeholder='Email' type={'email'} {...register('email', {
                                required: true,
                                pattern: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                                })}/>
                            <span className="flex items-center px-4"><HiAtSymbol size={25}/></span>
                        </div>
                        
                        <div className={errorNextAuth ? styles.input_group_Error : styles.input_group}>

                            <input className={`${styles.input_text} bg-slate-50`} placeholder='password' type={`${show ? 'password' : 'text'}`} {...register('password', {required: true})}/>

                            <span onClick={() => setshow(!show)} className="flex items-center px-4 cursor-pointer"><HiFingerPrint size={25}/></span>
                        </div>

                        <input id={styles.btnLogin} className="Saltar cursor-pointer p-1 m-2 w-80 border-2 border-b-slate-300 rounded-[5px] text-[20px] " type={'submit'} value="Ingresar"/>
                    </div>
                </form>
                
                <p className='mt-2'>Aun no tienes una cuenta? <Link className="text-blue-600" href={'/register'}>Registrate ahora!!!</Link></p>

                <div className="h-10 w-80">
                    <div className="flex flex-col items-center w-80 overflow-hidden pt-0 max-h-[25px] mt-5 absolute  ">
                        {(errors.email?.type === 'required' || errors.password?.type === 'required') && <p className="text-red-900">Complete todos los campos</p>}

                        {errorNextAuth && <p className="text-red-900">{errorNextAuth}</p>}
                    </div>
                </div>

                {errorNextAuth === 'Verifica el Email.' && 
                    <div>
                        <button className="text-black" onClick={() => ReenviarCorreo()}>Desea reenviar el Mail ?</button>
                    </div>
                }
            </div>
            
        </Layout>
    );
}
