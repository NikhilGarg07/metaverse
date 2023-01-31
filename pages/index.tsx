import Link from 'next/link'
import Header from "../components/common/Header";
import Footer from '../components/common/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="hero flex flex-col m-4 rounded-xl items-center">
          <h2 className='text-6xl flex-auto text-center p-4'>Experience the madness of Metaverse</h2>
          <div className='text-center flex-auto'>
            <Link href={`/scene/${Math.random().toString(36).slice(2)}`}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Play</button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
