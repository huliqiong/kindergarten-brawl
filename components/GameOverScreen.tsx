
import React from 'react';
import { ElementType } from '../types';
import { ELEMENT_ICONS } from '../constants';

interface GameOverScreenProps {
  winner: string | null;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, onRestart }) => {
  const isWin = winner === 'player';

  return (
    <div className="absolute inset-0 bg-[#1a1b26] z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Background Elements (Same as Intro) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {Object.values(ElementType).map((el, i) => (
          <div 
            key={el}
            className="absolute text-4xl animate-float-slow"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {ELEMENT_ICONS[el]}
          </div>
        ))}
      </div>

      <div className="z-10 max-w-lg w-full bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 border-4 border-slate-600 shadow-2xl text-center flex flex-col items-center animate-slideUpFade">
        
        {/* Title Area */}
        <div className="mb-6 relative">
          <div className={`absolute -inset-8 rounded-full blur-xl opacity-50 animate-pulse ${isWin ? 'bg-yellow-500' : 'bg-blue-900'}`}></div>
          <h1 className={`relative text-6xl md:text-7xl font-black text-transparent bg-clip-text drop-shadow-sm tracking-tight transform -rotate-3 ${isWin ? 'bg-gradient-to-br from-yellow-300 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-slate-500'}`}>
            {isWin ? '大获全胜!' : '遗憾落败'}
          </h1>
        </div>

        {/* Story Outcome */}
        <div className="space-y-4 mb-8 text-gray-200 leading-relaxed font-medium bg-black/20 p-6 rounded-xl border border-white/5">
          {isWin ? (
            <>
              <p>
                <span className="text-yellow-400 font-bold text-xl">恭喜！</span>
              </p>
              <p>
                经过一番激烈的元素对决，你成功守护了<span className="text-yellow-400">小熊饼干</span>的归属权！
              </p>
              <p>
                向日葵幼儿园的小朋友们都对你的指挥能力佩服得五体投地。现在，尽情享受胜利的美味吧！
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="text-blue-400 font-bold text-xl">哎呀...</span>
              </p>
              <p>
                虽然你的战术很精彩，但对手还是技高一筹，抢走了那块<span className="text-pink-400">小熊饼干</span>。
              </p>
              <p>
                不要气馁！幼儿园的战斗永不停歇。擦干眼泪，整理好心情，<span className="text-yellow-400">明天</span>的点心时间再战！
              </p>
            </>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onRestart}
          className={`
            group relative px-10 py-4 rounded-2xl font-bold text-xl shadow-[0_6px_0_rgba(0,0,0,0.3)] 
            active:shadow-none active:translate-y-2 transition-all w-full md:w-auto overflow-hidden
            ${isWin ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gradient-to-r from-slate-600 to-slate-700 text-gray-300'}
          `}
        >
           <span className="relative z-10 flex items-center justify-center gap-2">
             {isWin ? '再来一局 🍪' : '不服再战 😤'}
           </span>
           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
