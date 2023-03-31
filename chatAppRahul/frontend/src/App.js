import './App.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    <div className="App" style={{width:"100vw",height:"100vh", overflow:"hidden"}}>
     <Routes>
      <Route path='/' Component={HomePage}/>
      <Route path='/chat' Component={ChatPage}/>
     </Routes>
    </div>
  );
}

export default App;
