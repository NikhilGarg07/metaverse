import { OrbitControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const MeetingRoom = () => {
  const gltf = useLoader(GLTFLoader, './models/scene1.glb')
  return (
    <primitive object={gltf.scene} />
  )
}

const Scene = () => {
  return (
    <div className="container">
      <Canvas camera={ {fov: 75, near: 20, far: 100 }} >
        <gridHelper args={[20,10]}/>
        <OrbitControls/>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh scale={[2,2,2]}>
        <MeetingRoom />
        </mesh>
        <mesh rotation-x ={ Math.PI * -0.5}>
          <planeBufferGeometry args={[20,20]}/>
          <meshStandardMaterial color={'#458754'}/>
        </mesh>

      </Canvas>
    </div>
  );
}

export default Scene;