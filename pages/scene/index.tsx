import { OrbitControls, useGLTF } from '@react-three/drei'
import dynamic from "next/dynamic"
import { Canvas, ObjectMap } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader, Vector3 } from 'three'
const Avatar = dynamic(() => import("@/components/common/Avatar"))
const MeetingRoom = dynamic(() => import("@/components/common/MeetingRoom"))
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import Peer from "simple-peer"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Scene = () => {
    const texture = typeof window !== 'undefined' ? new TextureLoader().load('../images/checked_grass.jpg') : null;
    texture && (texture.wrapS = RepeatWrapping);
    texture && (texture.wrapT = RepeatWrapping);
    const router = useRouter();
    const { avatar: avatar } = router.query;
    const { name: myname } = router.query;
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [idToCall, setIdToCall] = useState('')
    const [position, setPosition] = useState<THREE.Vector3>()
    const [userPosition, setUserPosition] = useState<THREE.Vector3>()
    const [userAvatar, setUserAvatar] = useState('')
    const [name, setName] = useState(myname)
    const [muteMic, setMuteMic] = useState(false)
    const [hideVideo, setHideVideo] = useState(false)
    const [copy, setCopy] = useState(false)
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
            socketRef.current.emit('join', {})
        })

        socketRef.current.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const getUserPosition = (position: THREE.Vector3) => {
        setPosition(position)
        // console.log(position);

    }

    const Person = (position: Vector3, avatar: string) => {
        const model = useGLTF(`../models/${avatar}.glb`)
        position && model.scene.position.set(position.x, position.y, position.z);
        return (
            <primitive object={model.scene} />
        )
    }

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
                name: name,
            })
            socketRef.current.emit('sendAvatarData', { position: position, avatar: avatar })
        })
        peer.on("stream", (stream) => {
            // console.log({ userVideo });
            userVideo.current.srcObject = stream
            // console.log({ userVideo });
        })
        socketRef.current.on("callAccepted", (data) => {
            setCallAccepted(true)
            peer.signal(data.signal)
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

        socketRef.current.on('getAvatarData', data => {
            setUserPosition(data.position);
            console.log(data.position);
            
            setUserAvatar(data.avatar);
        })

        peer.on("signal", (data) => {
            socketRef.current.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            // console.log({ userVideo });
            userVideo.current.srcObject = stream
            // console.log({ userVideo });
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

    console.log({ userPosition })
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
                        <Avatar avatar={avatar} getUserPosition={getUserPosition} />
                        {callAccepted && !callEnded && userAvatar && userPosition && Person(userPosition,userAvatar)}
                    </Canvas>
                </div>
                <div className="client-container">
                    <div className='m-3'>
                        <span>{name}</span>
                        <CopyToClipboard onCopy={()=> setCopy(true)} text={me}>
                            <FontAwesomeIcon className='px-2' icon={faCopy}/>
                        </CopyToClipboard>
                        {copy && <span>Copied!</span>}
                        <div className='my-2'>
                            <input type="text" onChange={(e) => setIdToCall(e.target.value)} placeholder="Id" />

                        </div>
                        {callAccepted && !callEnded ? (
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={leaveCall}>
                                End Call
                            </button>
                        ) : (
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' aria-label="call" onClick={() => callUser(idToCall)}>
                                Call <FontAwesomeIcon icon={faPhone} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {stream && <div className='flex-1 border-2 border-solid border-sky-600 rounded m-3 relative mb-4'>
                            <video muted playsInline autoPlay ref={myVideo}></video>
                        </div>}
                        <div className='flex bg-amber-50 w-full p-2'>
                            <button className='flex-1' onClick={handleMic}>
                                <FontAwesomeIcon icon={muteMic ? faMicrophoneSlash : faMicrophone} size='xl' />
                            </button>
                            <button className='flex-1' onClick={handleVideo}>
                                <FontAwesomeIcon icon={hideVideo ? faVideo : faVideoSlash} size='xl' />
                            </button>
                        </div>
                        <div>
                            {receivingCall && !callAccepted ? (
                                <div>
                                    <h1 >{name} is calling...</h1>
                                    <button color="primary" onClick={answerCall}>
                                        Answer
						        </button>
                                </div>
                            ) : null}
                        </div>
                        {callAccepted && !callEnded && <div className='flex-1 border-2 border-solid border-sky-600 rounded m-3 relative'>
                            <video muted playsInline autoPlay ref={userVideo}></video>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Scene;