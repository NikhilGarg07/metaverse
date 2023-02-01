import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader } from 'three'
import Avatar from '@/components/common/Avatar'
import MeetingRoom from '@/components/common/MeetingRoom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { Peer } from 'peerjs'
import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

const Scene = () => {
  const texture = typeof window !== 'undefined' ? new TextureLoader().load('../images/checked_grass.jpg') : null;
  texture && (texture.wrapS = RepeatWrapping);
  texture && (texture.wrapT = RepeatWrapping);
  const [userId, setUserId] = useState('');
  const [remoteId, setRemoteId] = useState('')
  const userVideoRef = useRef<HTMLVideoElement>();
  const remoteVideoRef = useRef<HTMLVideoElement>();
  const peerRef = useRef<Peer>();
  const socketRef = useRef<Socket>();
  const RemoteUser = useRef();
  const userStream = useRef();

  useEffect(() => {

    // navigator.mediaDevices.getUserMedia({audio:true, video:true}).then(stream=>{
    //   userVideoRef.current && (userVideoRef.current?.srcObject = stream);
    //   userStream.current = stream;
    // })

  //   const peer = new Peer();
  //   peer.on('open', function (id) {
  //     setUserId(id);
  //     console.log(id);
      
  //   });
    
  //   peer.on('call',(call)=>{
  //     navigator.mediaDevices.getUserMedia(
  //       { video: true, audio: true }).then((stream) => {
  //         call.answer(stream); // Answer the call with an A/V stream.
  //         call.on("stream", (remoteStream) => {
  //           // Show stream in some <video> element.
  //           remoteVideoRef.current.srcObject = remoteStream;
  //           remoteVideoRef.current?.play()
  //         });
  //       },
  //       (err) => {
  //         console.error("Failed to get local stream", err);
  //       },
  //     );
  // })

  // peerRef.current = peer;
  }, [])

  const call = (id: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = peerRef.current.call(id, stream);
      call.on("stream", remoteStream => {
        // Show stream in some <video> element.
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current?.play();
      });
    })
  }

  return (
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
        <div className='h-1/4 flex-1 border-2 border-solid border-sky-600 rounded m-3 relative'>
          <video autoPlay ref={userVideoRef}></video>
          {/* <div className='absolute w-8/12 bg-slate-300 h-2/3'> */}
          {/* <FontAwesomeIcon icon={faMicrophone} width='100%' height='200px' /> */}
        </div>
        <div className='h-1/4 flex-1 border-2 border-solid border-sky-600 rounded m-3 relative'>

          <video autoPlay ref={remoteVideoRef}></video>
        </div>

        <input type="text" value={remoteId} onChange={(e)=> setRemoteId(e.value)} />
        <button onClick={()=> call(remoteId)}>Call</button>
      </div>
    </div>
  );
}

export default Scene;