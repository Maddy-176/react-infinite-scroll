import React,{useState,useEffect, useRef,useCallback} from 'react'
import axios from "axios";
import "../style/scroll.css"


const ScrollComponent=()=>{
    const[photos,setPhotos]= useState([]);
    const[loading, setLoading] = useState(false);
    const [page, setPage]= useState(0);

    const observerRef= useRef();

    const getPhotos=useCallback(async (page)=>{
        setLoading(true)
        const response =await axios.get(`https://api.thecatapi.com/v1/images/search?limit=9&page=${page}&order=Desc`);
         await setPhotos([...photos,...response.data]);
         await setLoading(false)
    },[photos])
    

    const loadingCSS = {
        height: "30px",
        margin: "30px"
      };

  

    
    const handleObserver=useCallback((entries)=>{
        const target= entries[0]
        if(target.isIntersecting){
            setPage(prev=>prev+1)
        }
      

    },[])

    useEffect(()=>{
        getPhotos(page);

        var options = {
            root: null,
            rootMargin: "50px",
            threshold: 1.0
          };

          const observer = new IntersectionObserver(handleObserver,options);
         if(observerRef.current) observer.observe(observerRef.current);
    },[page])


  return (
    <div className="container" >
         <div style={{minHeight:"800px"}}>
            <div className="grid-container">
            {photos.map(pic=>(
                <div key={`${pic.id}+${Math.random()}`} style={{margin:"10px"}} className='grid-item' >
             <img src={pic.url} height="300px" maxWidth="auto" alt="img"/>
                </div>
            ))}
            </div>
        </div> 
        <div ref={observerRef} style={loadingCSS}>
            <span style={{display:loading?"block":"none"}}>Loading...</span>
        </div>
        {console.log(page)}
    </div>
  )
}

export default ScrollComponent