import { SceneCanvas } from './components/scene/SceneCanvas';
import { TopBar } from './components/ui/TopBar';
import { Sidebar } from './components/ui/Sidebar';
import { CameraModeSwitch } from './components/ui/CameraModeSwitch';
import { TimeController } from './components/ui/TimeController';
import { ScaleNavigator } from './components/ui/ScaleNavigator';
import { LevelCaption } from './components/ui/LevelCaption';
import { EarthSurfaceView } from './components/ui/EarthSurfaceView';
import { EarthSurfaceControls } from './components/ui/EarthSurfaceControls';
import { ZoomTransitionOverlay } from './components/ui/ZoomTransitionOverlay';
import { useSelectionStore } from './store/selectionStore';

function App() {
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const earthSurfaceOpen = useSelectionStore((s) => s.earthSurfaceOpen);

  return (
    <div className="relative h-full w-full overflow-hidden bg-space">
      <div className="absolute inset-0">
        <SceneCanvas />
      </div>
      {earthSurfaceOpen && (
        <div className="absolute inset-0 z-[5]">
          <EarthSurfaceView />
        </div>
      )}
      <ZoomTransitionOverlay />
      <TopBar />
      <ScaleNavigator />
      <Sidebar />
      {earthSurfaceOpen ? <EarthSurfaceControls /> : <CameraModeSwitch />}
      {scaleLevel === 'solar' ? <TimeController /> : <LevelCaption level={scaleLevel} />}
    </div>
  );
}

export default App;
