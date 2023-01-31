import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MeetingRoom = () => {
    const gltf = useLoader(GLTFLoader, '../models/scene1.glb')
    return (
      <primitive object={gltf.scene} />
    )
  }

  export default MeetingRoom