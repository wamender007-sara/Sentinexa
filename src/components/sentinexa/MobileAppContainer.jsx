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
import { useCivicStore } from '../../store/useCivicStore';
import { startLiveLocationTracking } from '../../services/geoService';

export default function MobileAppContainer({ isStandAlone = false }) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [capturedData, setCapturedData] = useState(null);
  const [geoCamMode, setGeoCamMode] = useState('complaint');
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

  // Background passive GPS sensing for immediate district & location accuracy
  useEffect(() => {
    const unwatch = startLiveLocationTracking((loc) => {
      useCivicStore.getState().setUserLocation(loc);
    });
    return () => unwatch();
  }, []);

  const handleCaptureComplete = (arg1, arg2) => {
    // Support both (mode, data) and (data)
    let mode = 'complaint';
    let data = null;

    if (typeof arg1 === 'string') {
      mode = arg1;
      data = arg2;
    } else if (typeof arg1 === 'object') {
      data = arg1;
      mode = arg1.mode || 'complaint';
    }

    setCapturedData(data);
    if (mode === 'emergency') {
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
              setGeoCamMode(mode || 'complaint');
              setActiveScreen('geocam');
            }}
          />
        );
      case 'geocam':
        return (
          <Screen2GeoCamCapture 
            initialMode={geoCamMode}
            onClose={() => setActiveScreen('home')}
            onCapture={handleCaptureComplete}
            onProceedToFlow={handleCaptureComplete}
          />
        );
      case 'emergency':
        return (
          <Screen3AEmergencyFlow 
            photoData={capturedData}
            capturedData={capturedData}
            onBack={() => setActiveScreen('home')}
            onComplete={() => setActiveScreen('tickets')}
            onDispatched={() => setActiveScreen('tickets')}
          />
        );
      case 'complaint':
        return (
          <Screen3BComplaintFlow 
            photoData={capturedData}
            capturedData={capturedData}
            onBack={() => setActiveScreen('home')}
            onComplete={() => setActiveScreen('tickets')}
            onSubmitSuccess={() => setActiveScreen('tickets')}
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
        return <Screen1HomeDashboard onNavigate={setActiveScreen} onOpenGeoCam={() => setActiveScreen('geocam')} />;
    }
  };

  // Hide bottom bar on full-screen capture or active emergency dispatch
  const hideBottomNav = activeScreen === 'geocam' || activeScreen === 'emergency';

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* Mobile Phone Mockup Frame - Light Platinum Aesthetic on desktop, clean full-screen on mobile */}
      <div className={`relative w-full h-[100dvh] sm:w-[390px] sm:h-[844px] sm:max-h-[88vh] bg-[#F8FAFC] sm:rounded-[44px] sm:border-[8px] sm:border-slate-300 sm:shadow-[0_20px_60px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col font-sans select-none sm:ring-1 sm:ring-slate-200 ${
        isStandAlone ? 'max-h-screen' : ''
      }`}>
        
        {/* iOS Dynamic Island & Status Bar - Light Mode */}
        <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-bold text-slate-800 shrink-0 z-50 border-b border-slate-100">
          <span>{currentTime}</span>
          
          {/* Dynamic Island Pill with Sentinel Beacon */}
          <div className="h-5 px-3 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 shadow-sm border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] font-black font-sans tracking-wider text-white uppercase flex items-center">
              <span>SENTIN</span><span className="text-blue-400">EXA</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-[9px] font-mono text-blue-600 font-bold">5G</span>
            <Wifi className="w-3 h-3 text-slate-700" />
            <Battery className="w-3.5 h-3.5 text-slate-700" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-hidden relative bg-[#F8FAFC]">
          {renderScreen()}
        </div>

        {/* Bottom Navigation Bar - Clean Light UI */}
        {!hideBottomNav && (
          <div className="h-16 bg-white/95 backdrop-blur border-t border-slate-200 px-3 flex items-center justify-around shrink-0 z-40 shadow-sm">
            {/* Home */}
            <button
              onClick={() => setActiveScreen('home')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'home' ? 'text-blue-600 font-bold scale-105' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">Home</span>
            </button>

            {/* GIS Map */}
            <button
              onClick={() => setActiveScreen('map')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'map' ? 'text-blue-600 font-bold scale-105' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">GIS Map</span>
            </button>

            {/* Elevated Geo-Cam Shutter Button */}
            <div className="flex flex-col items-center justify-center -mt-5">
              <button
                type="button"
                onClick={() => setActiveScreen('geocam')}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-[3px] border-white flex items-center justify-center text-white shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
                aria-label="Geo Camera"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mt-0.5">
                Geo-Cam
              </span>
            </div>

            {/* Tickets */}
            <button
              onClick={() => setActiveScreen('tickets')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'tickets' ? 'text-blue-600 font-bold scale-105' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">Tickets</span>
            </button>

            {/* Telemetry / Agent */}
            <button
              onClick={() => setActiveScreen('telemetry')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'telemetry' ? 'text-blue-600 font-bold scale-105' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">Agents</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveScreen('settings')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeScreen === 'settings' ? 'text-blue-600 font-bold scale-105' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">Config</span>
            </button>
          </div>
        )}

        {/* Home Indicator bar */}
        <div className="h-4 bg-white flex justify-center items-center shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
