import React,{useState,useEffect, useRef,useCallback} from 'react'
import axios from "axios";

const ScrollComponent=()=>{
    const[photos,setPhotos]= useState([]);
    const[loading, setLoading] = useState(false);
    const [page, setPage]= useState(0);
    const [prevY, setPrevY]= useState(0);

    const observerRef= useRef();

    const getPhotos=useCallback(async (page)=>{
        setLoading(true)
        const response =await axios.get(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`);
         await setPhotos([...photos,...response.data]);
         await setLoading(false)
    },[photos])
    

    const loadingCSS = {
        height: "100px",
        margin: "30px"
      };

    const handleObserver=useCallback((entities,observer)=>{
        const y=entities[0].boundingClientRect.y;
        if(prevY>y){
            const lastPhoto= photos[photos.length-1];
            const currPage= lastPhoto.albumId;
            console.log("currpage",currPage)
            getPhotos(currPage);
            setPage(currPage);
        }
        setPrevY(y);
      

    },[getPhotos,photos,prevY]
    )

    useEffect(()=>{
        getPhotos(page);

        var options = {
            root: null,
            rootMargin: "1px",
            threshold: 1.0
          };

          const observer = new IntersectionObserver(handleObserver,options);
         if(observerRef.current) observer.observe(observerRef.current);
    },[handleObserver,getPhotos,page])


  return (
    <div className="container" >
         <div style={{minHeight:"800px"}}>
            {photos.map(pic=>(
                <span key={pic.id+Math.random()} style={{margin:"10px"}} >
                <img src={pic.url} height="100px" width="200px" alt="img"/>
                </span>
            ))}

        </div> 
        <div ref={observerRef} style={loadingCSS}>
            <span style={{display:loading?"block":"none"}}>Loading...</span>
            {console.log("photos",photos)}
        </div>
        {console.log(photos)}
    </div>
  )
}

export default ScrollComponent