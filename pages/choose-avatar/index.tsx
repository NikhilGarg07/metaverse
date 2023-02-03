import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useRouter } from "next/router";

const ChooseAvatar = () => {

    const router = useRouter()
    const handleClick = (avatar)=>{
      router.push({
        pathname: '/scene',
        query: {avatar}
      })
    }

    return (
        <>
            <Header />
            <div className="flex flex-col m-4">
                <div className="avatar-container flex justify-center p-4">
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg" src="../images/man.png" alt="" />
                        <div className="p-5">
                            <h5>Avatar Name</h5>
                            <div className="text-center m-2">
                                <button onClick={()=>handleClick('man')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg" src="../images/man2.png" alt="" />
                        <div className="p-5">
                            <h5>Avatar Name</h5>
                            <div className="text-center m-2">
                                <button onClick={()=>handleClick('man2')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg" src="../images/woman.png" alt="" />
                        <div className="p-5">
                            <h5>Avatar Name</h5>
                            <div className="text-center m-2">
                                <button onClick={()=>handleClick('woman')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Choose</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ChooseAvatar;