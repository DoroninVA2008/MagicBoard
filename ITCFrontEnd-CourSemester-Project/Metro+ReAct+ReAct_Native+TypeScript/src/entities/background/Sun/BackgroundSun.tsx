import Cloud from "@/shared/images/cloud.svg"
import Sun from "@/shared/images/sun.svg"

export const BackgroundSun = () => {
    return (
        <>
            <Sun
                width={'85%'} 
                height={'80%'} 
                style={{position: 'absolute', right: 0, top: '-20%'}}
            />
            <Cloud
                width={'55%'}
                style={{position: 'absolute', left: '-15%', top: '20%'}}
            />
            <Cloud
                width={'55%'}
                style={{position: 'absolute', right: '-15%', top: '35%'}}
            />
            <Cloud
                width={'55%'}
                style={{position: 'absolute', left: '-15%', top: '50%'}}
            />
            <Cloud
                width={'55%'}
                style={{position: 'absolute', right: '-15%', top: '70%'}}
            />
            <Cloud
                width={'55%'}
                style={{position: 'absolute', left: '-15%', top: '85%'}}
            />
        </>
    )
}