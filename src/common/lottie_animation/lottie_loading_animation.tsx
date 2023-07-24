import { useLottie } from 'lottie-react';
import groovyWalkAnimation from "./ton_duck_loading.json";
import { CSSProperties } from 'react';


const style: CSSProperties = {
    overflow: 'hidden',
    borderRadius: 100,
    width: 250,
    height: 280,
    margin: '0 auto'
};
export const AnimationLoading = () => {
    const options = {
        animationData: groovyWalkAnimation,
        loop: true,
        autoplay: true,
    }

    const { View } = useLottie(options, style);

    return View;
}