import React, {useEffect, useState} from 'react'

function App(){

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data.users)
      }
    )
  }, [])

  return(
    <div>

    </div>
  )
}

//HALLO
// hey

export default App

