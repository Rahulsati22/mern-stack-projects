import './App.css';
import {Routes, Route} from 'react-router-dom'
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
function App() {
  return (
    <div className="App" style={{width:"100vw", height:"100vh", overflow:"hidden"}}>
      <Routes>
        <Route path='/' Component={Homepage}/>
        <Route path='/chat' Component={Chatpage}></Route>
      </Routes>
    </div>
  );
}

export default App;
