import { useInput } from "@/hooks/userInput";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'
import * as THREE from 'three'

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

const directionOffset = ({ forward, backward, left, right }) => {
    var directionOffset = 0;

    if (forward) {
        if (left) {
            directionOffset = Math.PI / 4;
        } else if (right) {
            directionOffset = -Math.PI / 4;
        }
    } else if (backward) {
        if (left) {
            directionOffset = Math.PI / 4 + Math.PI / 2;
        } else if (right) {
            directionOffset = -Math.PI / 4 - Math.PI / 2;
        } else {
            directionOffset = Math.PI;
        }
    } else if (left) {
        directionOffset = Math.PI / 2;
    } else if (right) {
        directionOffset = -Math.PI / 2;
    }

    return directionOffset;
}

function modelInRange(x: number, z: number) {
    if(x>3 && x<4 && z<-3 && z>-4){
        return true;
    }
    return false;
}

const Avatar = () => {
    
    const { forward, backward, left, right, jump, shift } = useInput();
    const [sit, setsit] = useState(false)

    const model = useGLTF('../models/employee.glb')
    // console.log(model);
    const { actions } = useAnimations(model.animations, model.scene);

    model.scene.scale.set(1.8, 1.8,1.8)
    model.scene.castShadow = true

    const currentAction = useRef("");
    const controlsRef = useRef<typeof OrbitControls>();
    const camera = useThree(state => state.camera);

    const updateCameraTarget = (moveX: number, moveZ: number) => {
        camera.position.x += moveX;
        camera.position.z += moveZ;

        cameraTarget.x = model.scene.position.x;
        cameraTarget.y = model.scene.position.y + 2;
        cameraTarget.z = model.scene.position.z;
        if (controlsRef.current) controlsRef.current.target = cameraTarget;
    }

    useEffect(() => {
        let action = "";
        if (forward || backward || left || right) {
            action = 'walking';
        }else if(shift  && modelInRange(model.scene.position.x, model.scene.position.z)){
            //3.2716836427243208 -3.432373491323713
            setsit(prev=> !prev); 
        }else {
            if(sit) action='sitting'
            else action = 'idle';
        }

        if (currentAction.current != action) {
            const nextActionToPlay = actions[action];
            const current = actions[currentAction.current];
            current?.fadeOut(0.2);
            nextActionToPlay?.reset().fadeIn(0.2).play();
            currentAction.current = action;
        }
    }, [forward, backward, left, right, jump, shift])

    useFrame((state, delta) => {
        if (currentAction.current == 'walking') {
            let angleYCameraDirection = Math.atan2(
                camera.position.x - model.scene.position.x,
                camera.position.z - model.scene.position.z
            );

            let newDirectionOffset = directionOffset({
                forward,
                backward,
                left,
                right
            });
            
            rotateQuaternion.setFromAxisAngle(
                rotateAngle,
                angleYCameraDirection + newDirectionOffset
            );
            model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2);

            camera.getWorldDirection(walkDirection);
            walkDirection.y = 0;
            walkDirection.normalize();
            walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

            const velocity = 5;

            const moveX = walkDirection.x * velocity * delta;
            const moveZ = walkDirection.z * velocity * delta;
            model.scene.position.x += moveX;
            model.scene.position.z += moveZ;
            updateCameraTarget(moveX, moveZ);
        }
    })

    return (
        <>
            <OrbitControls ref={controlsRef} />
            <primitive object={model.scene} />
        </>
    )
}

export default Avatar;


