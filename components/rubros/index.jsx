import React from 'react';
import styles from 'styles/Home.module.css'
import Image from 'next/image'

const Index = () => {
    return (
        <div className={styles.Rubros}>

          <div href="#" className={`${styles.box} ${styles.R1}`}>
            <span href="#" className="group relative h-full block bg-black w-full">
            <Image
                height={600}
                width={600}
                alt={"Medicamentos"}
                src="/assets/Medicamentos.jpg"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
              />

              <div className="relative p-8 h-full">
                <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                  Rubro
                </p>

                <p className="text-2xl font-bold text-white">Medicamentos</p>

                <div className="h-full mt-6">
                  <div
                    className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <p className="text-sm text-white">
                    
                    </p>
                  </div>
                </div>
              </div>
            </span>

          </div>

          <div href="#" className={`${styles.box} ${styles.R2}`}>
            <span href="#" className="group relative h-full block bg-black w-full">
              <Image
                height={600}
                width={600}
                alt={"Descartables"}
                src="/assets/Descartables.jpg"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
              />

              <div className="relative p-8 h-full">
                <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                  Rubro
                </p>

                <p className="text-2xl font-bold text-white">Descartables</p>

                <div className="h-full mt-6">
                  <div
                    className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <p className="text-sm text-white">
                      
                    </p>
                  </div>
                </div>
              </div>
            </span>

          </div>

          <div href="#" className={`${styles.box} ${styles.R3}`}>
            <span href="#" className="group relative h-full block bg-black w-full">
            <Image
                height={600}
                width={600}
                alt={"Cigarrillos"}
                src="/assets/Cigarros.jpg"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
              />

              <div className="relative p-8 h-full">
                <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                  Rubro
                </p>

                <p className="text-2xl font-bold text-white">Cigarrillos</p>

                <div className="h-full mt-6">
                  <div
                    className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <p className="text-sm text-white">
                      
                    </p>
                  </div>
                </div>
              </div>
            </span>
          </div>

          <div href="#" className={`${styles.box} ${styles.R4}`}>
            <span href="#" className="group relative h-full block bg-black w-full">
            <Image
                height={600}
                width={600}
                alt={"Golosinas"}
                src="/assets/Golosinas.jpg"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
              />

              <div className="relative p-8 h-full">
                <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                  Rubro
                </p>

                <p className="text-2xl font-bold text-white">Golocinas</p>

                <div className="h-full mt-6">
                  <div
                    className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <p className="text-sm text-white">
                      
                    </p>
                  </div>
                </div>
              </div>
            </span>
          </div>

        </div>
    );
}

export default Index;
