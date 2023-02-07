import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const Person = ({ pos, av, action }) => {
    const model = useGLTF(`../models/${av}.glb`);
    model.scene.position.set(pos.x, pos.y, pos.z);
    console.log({pos});
    
    model.scene.scale.set(1.8, 1.8, 1.8)
    model.scene.castShadow = true;
    const currentAction = useRef("");
    const { actions } = useAnimations(model.animations, model.scene);
    if (currentAction.current != action) {
        const nextActionToPlay = actions[action];
        const current = actions[currentAction.current];
        current?.fadeOut(0.2);
        nextActionToPlay?.reset().fadeIn(0.2).play();
        currentAction.current = action;
    }

    return (
        <primitive object={model.scene} />
    )
}

export default Person;