import React from 'react';

interface VisualFocusRoomProps {
    theme: 'light' | 'dark' | 'calm';
}

const Cloud = ({ className, style }: { className: string, style: React.CSSProperties }) => (
    <div className={`absolute rounded-full filter blur-3xl ${className}`} style={style}></div>
);

const Candle = () => (
    <div className="absolute bottom-10 right-10 flex flex-col items-center pointer-events-none">
        {/* Flame */}
        <div 
            className="w-2 h-4 bg-orange-400 rounded-full filter blur-[3px] animate-flicker"
        ></div>
        {/* Wick */}
        <div className="w-px h-2 bg-gray-900/70"></div>
        {/* Wax */}
        <div className="w-4 h-12 bg-amber-100/70 rounded-t-full rounded-b-sm filter blur-[1px]"></div>
    </div>
);


export const VisualFocusRoom: React.FC<VisualFocusRoomProps> = ({ theme }) => {
    const cloudColors = {
        light: ['bg-pink-300/30', 'bg-blue-300/30'],
        dark: ['bg-indigo-500/20', 'bg-purple-600/20'],
        calm: ['bg-purple-500/20', 'bg-teal-500/10'],
    };

    const showCandle = theme === 'dark' || theme === 'calm';

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
            <Cloud
                className={`${cloudColors[theme][0]} animate-float`}
                style={{
                    width: '50vw',
                    height: '50vw',
                    top: '5%',
                    left: '10%',
                    animationDuration: '25s',
                }}
            />
            <Cloud
                className={`${cloudColors[theme][1]} animate-float`}
                style={{
                    width: '40vw',
                    height: '40vw',
                    bottom: '10%',
                    right: '15%',
                    animationDuration: '35s',
                    animationDelay: '-5s',
                }}
            />
            {showCandle && <Candle />}
        </div>
    );
};