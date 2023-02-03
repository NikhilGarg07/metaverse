import { OrbitControls } from '@react-three/drei'
import dynamic from "next/dynamic"
import { Canvas } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader } from 'three'
const Avatar = dynamic(() => import("@/components/common/Avatar"))
const MeetingRoom = dynamic(() => import("@/components/common/MeetingRoom"))
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash, faPhone } from '@fortawesome/free-solid-svg-icons'
import Peer from "simple-peer"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'

const Scene = () => {
    const texture = typeof window !== 'undefined' ? new TextureLoader().load('../images/checked_grass.jpg') : null;
    texture && (texture.wrapS = RepeatWrapping);
    texture && (texture.wrapT = RepeatWrapping);
    const router = useRouter();
    const { avatar: avatar } = router.query;
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [idToCall, setIdToCall] = useState('')
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [muteMic, setMuteMic] = useState(false)
    const [hideVideo, setHideVideo] = useState(false)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    const socketRef = useRef()

    useEffect(() => {

        socketRef.current = io('http://localhost:8000')

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current && (myVideo.current.srcObject = stream);
        })

        console.log(socketRef.current.id);


        socketRef.current.on("me", (id) => {
            setMe(id);

        })

        socketRef.current.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            console.log('Socket CallUser', { data });
        })
    }, [])

    const handleVideo = () => {
        if (myVideo.current) {
            var videoTrack = myVideo.current.srcObject.getTracks().find(track => track.kind === 'video');
        }

        if (videoTrack.enabled) {
            videoTrack.enabled = false
            setHideVideo(true)

        } else {
            videoTrack.enabled = true;
            setHideVideo(false)
        }
    }

    const handleMic = () => {
        if (myVideo.current) {
            var audioTrack = myVideo.current.srcObject.getTracks().find(track => track.kind === 'audio');
        }

        if (audioTrack.enabled) {
            audioTrack.enabled = false
            setMuteMic(true)

        } else {
            audioTrack.enabled = true;
            setMuteMic(false)
        }
    }

    const callUser = (id) => {
        console.log('call User Started');

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on('signal', (data) => {
            socketRef.current.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {
            console.log({ userVideo });
            userVideo.current.srcObject = stream
            console.log({ userVideo });
        })
        socketRef.current.on("callAccepted", (signal) => {
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
            socketRef.current.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            console.log({ userVideo });
            userVideo.current.srcObject = stream
            console.log({ userVideo });
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

    console.log(avatar);

    return (
        <>
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
                        <Avatar avatar={avatar} />
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

                    <button onClick={handleMic}>
                        <FontAwesomeIcon icon={muteMic ? faMicrophoneSlash : faMicrophone}/>
                    </button>
                    <button onClick={handleVideo}>
                        {hideVideo ? 'show video' : 'hide video'}
                    </button>
                    <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" />
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