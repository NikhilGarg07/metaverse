import Link from 'next/link'
import Header from "../components/common/Header";
import Footer from '../components/common/Footer';
import Head from 'next/head';

export default function Home() {

  return (
    <>
      <Head>
        <title>Metaverse</title>
      </Head>
      <Header />
      <main>
        <div className="hero flex flex-col m-4 rounded-xl items-center justify-center">
        <h5 className='font-mono text-3xl top-0 mb-7'>TECHSPIDERS</h5>
          <h5 className='font-mono text-blue-600/75 text-5xl text-center p-0'>Experience the madness of</h5>
          <h1 className='font-mono text-white text-9xl text-center p-0 mb-5'>METAVERSE</h1>
          <div className='text-center'>
            <Link href={`/choose-avatar`}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Enter Metaverse</button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
