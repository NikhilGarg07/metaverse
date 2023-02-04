import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useState } from 'react'
import { useRouter } from "next/router";

const ChooseAvatar = () => {
    const [name, setName] = useState('')
    const router = useRouter()
    const handleClick = (avatar: string)=>{
      router.push({
        pathname: '/scene',
        query: {avatar,name}
      })
    }

    return (
        <>
            <Header />
            <div className="flex flex-col m-4">
                <div className="avatar-container flex rounded-lg justify-center p-4">
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg w-full h-80 object-cover" src="../images/man.png" alt="" />
                        <div className="p-5 flex justify-between items-center">
                            <span>John Doe</span>
                            <button onClick={()=>handleClick('man')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button> 
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg w-full h-80 object-cover" src="../images/man2.png" alt="" />
                        <div className="p-5 flex justify-between items-center">
                            <span>Bill Gates</span>
                            <button onClick={()=>handleClick('man2')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button>
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg w-full h-80 object-cover" src="../images/woman.png" alt="" />
                        <div className="p-5 flex justify-between items-center">
                            <span>Daisy Williams</span>
                                <button onClick={()=>handleClick('woman')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button>                            
                        </div>
                    </div>
                </div>
                <div>
                    <input type="text" name="name" id="name" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter your name here" />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ChooseAvatar;