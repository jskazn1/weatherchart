import React, {useState, useContext} from 'react';
import './App.css';
import {Input, Button} from 'antd'

const context = React.createContext()

function App() {
  const [state, setState] = useState({
    searchTerm:''
  })
  return <context.Provider value={{ //all other functions (ex. Header()) has access to this context.Provider
    ...state,
    set: v=>setState({...state, ...v})
  }}>
    <div className="App">
      <Header />
      {state.error && <div>{state.error}</div>}
    </div>
  </context.Provider>
}

function Header() {
  const ctx = useContext(context)
  

  
  return <header className="App-header">
    <Input 
      value={ctx.searchTerm}
      onChange={e=> ctx.set({searchTerm: e.target.value})}
      style={{height:'3rem', fontSize:'2rem'}}
      onKeyPress={e=>{
        if(e.key==='Enter'&& ctx.searchTerm) search(ctx)
      }}
    />
    <Button 
      style={{marginLeft:5, height:'3rem'}}
      onClick={()=> search(ctx)} type="primary"
      disabled={!ctx.searchTerm}>
      Search
    </Button>
  </header>
}

async function search({searchTerm, set}){
  try{
    set({searchTerm:'', error:''})

    const osmurl = `https://nominatim.openstreetmap.org/search/${searchTerm}?format=json`
    const r = await fetch(osmurl)
    const loc = await r.json()
    if(!loc[0]){
      return set({error:'No city matching that search'})
    }
    const city = loc[0]
    const key = '3189086587da8a6ebabb2d1fa9d02547'
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
    const r2 = await fetch(url)
    const weather = await r2.json()
    set({weather})
  } catch(e) {
    set({error: e.message})
  }
}
export default App;
