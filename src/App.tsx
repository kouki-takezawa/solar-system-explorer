import { SceneCanvas } from './components/scene/SceneCanvas';
import { TopBar } from './components/ui/TopBar';
import { Sidebar } from './components/ui/Sidebar';
import { CameraModeSwitch } from './components/ui/CameraModeSwitch';
import { TimeController } from './components/ui/TimeController';
import { ScaleNavigator } from './components/ui/ScaleNavigator';
import { LevelCaption } from './components/ui/LevelCaption';
import { EarthSurfaceView } from './components/ui/EarthSurfaceView';
import { useSelectionStore } from './store/selectionStore';

function App() {
  const scaleLevel = useSelectionStore((s) => s.scaleLevel);
  const earthSurfaceOpen = useSelectionStore((s) => s.earthSurfaceOpen);

  return (
    <div className="relative h-full w-full overflow-hidden bg-space">
      <div className="absolute inset-0">
        <SceneCanvas />
      </div>
      <TopBar />
      <ScaleNavigator />
      <Sidebar />
      <CameraModeSwitch />
      {scaleLevel === 'solar' ? <TimeController /> : <LevelCaption level={scaleLevel} />}
      {earthSurfaceOpen && <EarthSurfaceView />}
    </div>
  );
}

export default App;
