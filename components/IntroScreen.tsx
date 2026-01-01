import React from 'react';
import { ElementType } from '../types';
import { ELEMENT_ICONS } from '../constants';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-[#1a1b26] z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="z-10 max-w-lg w-full bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border-4 border-slate-600 shadow-2xl text-center flex flex-col items-center">
        
        {/* Title Logo Area */}
        <div className="mb-6 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <h1 className="relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-orange-500 drop-shadow-sm tracking-tight transform -rotate-3">
            幼儿园<br/>大乱斗
          </h1>
        </div>

        {/* Story */}
        <div className="space-y-4 mb-8 text-gray-200 leading-relaxed font-medium">
          <p>
            在传说的<span className="text-yellow-400 font-bold">向日葵幼儿园</span>，午睡时间刚刚结束...
          </p>
          <p>
            为了争夺最后一块<span className="text-pink-400 font-bold">小熊饼干</span>的归属权，
            性格各异的小朋友们觉醒了体内的元素之力！
          </p>
          <p className="text-sm text-gray-400 italic mt-2 border-t border-slate-600 pt-2">
            " 投掷骰子，积攒能量，释放超可爱的必杀技！ "
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-xl shadow-[0_6px_0_rgb(30,58,138)] active:shadow-none active:translate-y-2 transition-all w-full md:w-auto overflow-hidden"
        >
           <span className="relative z-10 flex items-center justify-center gap-2">
             开始游戏 🎮
           </span>
           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <div className="mt-6 text-xs text-gray-500">
           Based on Genius Invokation TCG Rules
        </div>
      </div>
    </div>
  );
};