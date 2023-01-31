import { useGLTF } from "@react-three/drei";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { io } from 'socket.io-client'

const Avatar = () => {

    const router = useRouter();

    const { id: roomId } = router.query;

    useEffect(() => {
        
        const socket = io('http://localhost:8000')

        socket.on('connect', () => {
            console.log(`You connected with ID: ${socket.id}`);
        })

        socket.emit('join-room', roomId);

        socket.on('user-connected', userId=>{
            console.log('User Connected', userId);
            
        })
    }, [roomId]);

    const model = useGLTF('../models/human.glb')
    console.log(model);
    model.scene.castShadow = true
    
    return (
        <primitive object={model.scene} useHelp />
    )
}

export default Avatar;