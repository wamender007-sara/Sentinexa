import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Camera, ClipboardList, Activity, Settings, 
  Wifi, Battery, ShieldAlert, Cpu
} from 'lucide-react';

import Screen1HomeDashboard from './screens/Screen1HomeDashboard';
import Screen2GeoCamCapture from './screens/Screen2GeoCamCapture';
import Screen3AEmergencyFlow from './screens/Screen3AEmergencyFlow';
import Screen3BComplaintFlow from './screens/Screen3BComplaintFlow';
import Screen4GISMapView from './screens/Screen4GISMapView';
import Screen5TicketTracker from './screens/Screen5TicketTracker';
import Screen6Telemetry from './screens/Screen6Telemetry';
import Screen7ProfileSettings from './screens/Screen7ProfileSettings';

export default function MobileAppContainer({ isStandAlone = false }) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [capturedData, setCapturedData] = useState(null);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptureComplete = (data) => {
    setCapturedData(data);
    if (data.mode === 'emergency') {
      setActiveScreen('emergency');
    } else {
      setActiveScreen('complaint');
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <Screen1HomeDashboard 
            onNavigate={(screen) => setActiveScreen(screen)}
            onOpenGeoCam={(mode) => {
              setActiveScreen('geocam');
            }}
          />
        );
      case 'geocam':
        return (
          <Screen2GeoCamCapture 
            onClose={() => setActiveScreen('home')}
            onCapture={handleCaptureComplete}
          />
        );
      case 'emergency':
        return (
          <Screen3AEmergencyFlow 
            capturedData={capturedData}
            onBack={() => setActiveScreen('home')}
            onDispatched={(ticket) => setActiveScreen('tickets')}
          />
        );
      case 'complaint':
        return (
          <Screen3BComplaintFlow 
            capturedData={capturedData}
            onBack={() => setActiveScreen('home')}
            onSubmitSuccess={(ticket) => setActiveScreen('tickets')}
          />
        );
      case 'map':
        return <Screen4GISMapView />;
      case 'tickets':
        return <Screen5TicketTracker onNewReport={() => setActiveScreen('geocam')} />;
      case 'telemetry':
        return <Screen6Telemetry />;
      case 'settings':
        return <Screen7ProfileSettings onBack={() => setActiveScreen('home')} />;
      default:
        return <Screen1HomeDashboard onNavigate={setActiveScreen} />;
    }
  };

  // Hide bottom bar on full-screen capture or active emergency dispatch
  const hideBottomNav = activeScreen === 'geocam' || activeScreen === 'emergency';

  return (
    <div className="w-full flex justify-center items-center">
      {/* Mobile Phone Mockup Frame */}
      <div className={`relative w-[375px] h-[812px] max-h-[85vh] bg-[#070b14] rounded-[42px] border-[6px] border-slate-700/80 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-sans select-none ring-1 ring-white/10 ${
        isStandAlone ? 'max-h-screen' : ''
      }`}>
        
        {/* iOS Dynamic Island & Status Bar */}
        <div className="h-10 bg-black/90 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-semibold text-white/90 shrink-0 z-50">
          <span>{currentTime}</span>
          {/* Dynamic Pill */}
          <div className="w-24 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] font-mono text-cyan-400">SENTINEXA</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[9px] font-mono text-emerald-400">5G</span>
            <Wifi className="w-3 h-3 text-cyan-400" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-hidden relative bg-[#0a0f1d]">
          {renderScreen()}
        </div>

        {/* Bottom Navigation Bar */}
        {!hideBottomNav && (
          <div className="h-16 bg-[#090d19]/95 backdrop-blur border-t border-cyan-500/20 px-3 flex items-center justify-around shrink-0 z-40">
            {/* Home */}
            <button
              onClick={() => setActiveScreen('home')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'home' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">Home</span>
            </button>

            {/* GIS Map */}
            <button
              onClick={() => setActiveScreen('map')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'map' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">GIS Map</span>
            </button>

            {/* Elevated Geo-Cam Shutter Button */}
            <button
              onClick={() => setActiveScreen('geocam')}
              className="relative -top-4 w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border-4 border-[#070b14] flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-transform"
              title="Geo Camera"
            >
              <Camera className="w-6 h-6 text-white" />
              <span className="absolute -bottom-5 text-[9px] font-bold text-cyan-400 uppercase tracking-tighter">
                Geo-Cam
              </span>
            </button>

            {/* Tickets */}
            <button
              onClick={() => setActiveScreen('tickets')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'tickets' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">Tickets</span>
            </button>

            {/* Telemetry / Agent */}
            <button
              onClick={() => setActiveScreen('telemetry')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'telemetry' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">Agents</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveScreen('settings')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'settings' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">Config</span>
            </button>
          </div>
        )}

        {/* Home Indicator bar */}
        <div className="h-4 bg-[#070b14] flex justify-center items-center shrink-0">
          <div className="w-32 h-1 bg-slate-600/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
