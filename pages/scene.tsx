import { OrbitControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const MeetingRoom = () => {
  const gltf = useLoader(GLTFLoader, './models/scene1.glb')
  return (
    <primitive object={gltf.scene} />
  )
}

const Scene = () => {

  const texture = new TextureLoader().load('./images/checked_grass.jpg');
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return (
    <div className="container">
      <Canvas camera={{ fov: 90, near: 2, far: 100 }} >
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh scale={[2, 2, 2]}>
          <MeetingRoom />
        </mesh>
        <mesh position={[-1, -0.3, 0]} rotation-x={Math.PI * -0.5}>
          <planeBufferGeometry args={[50, 50]} />
          <meshStandardMaterial map={ texture } />
        </mesh>

      </Canvas>
    </div>
  );
}

export default Scene;