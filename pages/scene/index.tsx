import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader } from 'three'
import Avatar from '@/components/common/Avatar'
import MeetingRoom from '@/components/common/MeetingRoom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faPhone } from '@fortawesome/free-solid-svg-icons'
import Peer from "simple-peer"
import { useEffect, useRef, useState } from 'react'
// import { useRouter } from "next/router";
import io from 'socket.io-client'
import Head from 'next/head'


const socket = io('http://localhost:8000')
const Scene = () => {
    const texture = typeof window !== 'undefined' ? new TextureLoader().load('../images/checked_grass.jpg') : null;
    texture && (texture.wrapS = RepeatWrapping);
    texture && (texture.wrapT = RepeatWrapping);
    // const router = useRouter();
    // const { id: roomId } = router.query;
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [idToCall, setIdToCall] = useState('')
    const [name, setName] = useState('')
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
            setStream(stream)
            if (myVideo.current != undefined) {
                myVideo.current.srcObject = stream
            }
        })

        socket.on("me", (id) => {
            setMe(id)
            console.log('Id===>', id);

        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            console.log('Socket CallUser', { data });
        })
    }, [])

    const callUser = (id) => {
        console.log('call User Started');

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on('signal', (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {
            console.log({userVideo}); 
            userVideo.current.srcObject = stream
            console.log({userVideo});
        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer;
        console.log('call User Ended');
        console.log({ callAccepted, callEnded, receivingCall });
    }

    const answerCall = () => {
        console.log('Answer Call Started');

        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            console.log({userVideo});
            userVideo.current.srcObject = stream
            console.log({userVideo});
        })

        peer.signal(callerSignal)
        connectionRef.current = peer;

        console.log('Answer Call Ended');

    }

    const leaveCall = () => {
        setCallEnded(true)
        console.log('In Leave Call');

        connectionRef.current.destroy()
    }

    return (
        <>
            <Head>
                <script src="https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js"></script>
            </Head>
            <div className="flex flex-row">
                <div className="container">
                    <Canvas camera={{ fov: 75, far: 100 }} >
                        <OrbitControls />
                        <ambientLight intensity={0.8} />
                        <directionalLight color="red" position={[0, 0, 5]} />
                        <mesh scale={[2, 2, 2]}>
                            <MeetingRoom />
                        </mesh>
                        <mesh position={[-1, -0.3, 0]} rotation-x={Math.PI * -0.5}>
                            <planeBufferGeometry args={[50, 50]} />
                            <meshStandardMaterial map={texture} />
                        </mesh>
                        <Avatar />
                    </Canvas>
                </div>
                <div className=" client-container flex-col">
                    <div className='h-1/4 flex-1 border-2 border-solid border-sky-600 rounded m-3 relative mb-4'>
                        {stream && <video muted width='100%' playsInline autoPlay ref={myVideo}></video>}
                        {/* <div className='absolute w-8/12 bg-slate-300 h-2/3'> */}
                        {/* <FontAwesomeIcon icon={faMicrophone} width='100%' height='200px' /> */}
                    </div>
                    <div className='h-1/4 flex-1 border-2 border-solid border-sky-600 rounded m-3 relative'>
                        {callAccepted && !callEnded ?
                            <video playsInline autoPlay ref={userVideo}></video> :
                            null}
                    </div>
                    <h5>{me}</h5>
                    <input type="text" onChange={(e) =>setName(e.target.value)} value={name} placeholder="Name" />
                    <input type="text" onChange={(e) => setIdToCall(e.target.value)} placeholder="Id" />
                    {callAccepted && !callEnded ? (
                        <button variant="contained" color="secondary" onClick={leaveCall}>
                            End Call
                        </button>
                    ) : (
                        <button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                            <FontAwesomeIcon icon={faPhone} />
                        </button>
                    )}
                    
                    <div>
                        {receivingCall && !callAccepted ? (
                            <div className="caller">
                                <h1 >{name} is calling...</h1>
                                <button color="primary" onClick={answerCall}>
                                    Answer
						        </button>
                            </div>
                        ) : null}
                    </div>
                </div>

            </div>
        </>
    );
}

export default Scene;