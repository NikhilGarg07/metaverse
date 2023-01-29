import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Header from "../components/common/Header";
import Footer from '../components/common/Footer';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="hero flex flex-col m-4 rounded-xl items-center">
          <h2 className='text-6xl flex-auto text-center p-4'>Experience the madness of Metaverse</h2>
          <div className='text-center flex-auto'>
            <Link href={'/scene'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Play</button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
